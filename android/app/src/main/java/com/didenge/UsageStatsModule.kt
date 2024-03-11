package com.didenge

import android.app.AppOpsManager
import android.app.AppOpsManager.OPSTR_GET_USAGE_STATS
import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Process
import android.provider.Settings
import android.util.Log
import androidx.annotation.NonNull
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone


class UsageStatsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        private lateinit var reactContext: ReactApplicationContext
    }

    init {
        UsageStatsModule.reactContext = reactContext
    }

    @NonNull
    override fun getName(): String {
        return "UsageStatsModule"
    }

    @ReactMethod
    fun getUsageStats(startTime: Double, endTime: Double, promise: Promise) {
        val packageManager: PackageManager = reactContext!!.packageManager
        val result: WritableMap = WritableNativeMap()

        Log.d("UsageStats", "StartTime: $startTime, EndTime: $endTime")

        val usageStatsManager =
                reactContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val queryUsageStats : List<UsageStats> = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime.toLong(),
                endTime.toLong()
        )

        for (us in queryUsageStats) {
            if (us.totalTimeInForeground > 0) {
                val usageStats: WritableMap = WritableNativeMap()
                usageStats.putString("packageName", us.packageName)
                val totalTimeInSeconds = us.totalTimeInForeground / 1000
                usageStats.putDouble("totalTimeInForeground", totalTimeInSeconds.toDouble())
                result.putMap(us.packageName, usageStats)
            }
        }

        promise.resolve(result)
    }

    private fun packageExists(packageName: String): Boolean {
        val packageManager: PackageManager? = reactContext?.getPackageManager()
        var info: ApplicationInfo? = null
        info =
                try {
                    packageManager?.getApplicationInfo(packageName, 0)
                } catch (e: PackageManager.NameNotFoundException) {
                    e.printStackTrace()
                    return false
                }
        return true
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun showUsageAccessSettings(packageName: String) {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
        if (packageExists(packageName)) {
            intent.setData(Uri.fromParts("package", packageName, null))
        }
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactContext?.startActivity(intent)
    }

    @ReactMethod
    fun checkForPermission(promise: Promise) {
        val appOps: AppOpsManager =
                reactContext?.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager

        val uid = Process.myUid()

        val mode: Int =
                appOps.checkOpNoThrow(
                        OPSTR_GET_USAGE_STATS,
                        uid,
                        reactContext?.packageName!!
                )

        promise.resolve(mode == AppOpsManager.MODE_ALLOWED)
    }



    private fun sendEvent(packageName: String, totalTimeInForeground: Long) {
        if (reactContext.hasActiveCatalystInstance()) {
            val sdf = SimpleDateFormat("HH:mm:ss", Locale.getDefault())
            sdf.timeZone = TimeZone.getTimeZone("UTC")
            val formattedTime = sdf.format(Date(totalTimeInForeground))

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("UsageStatsEvent", "$packageName: $formattedTime")
        }
    }


}
