package com.didenge

import android.app.AppOpsManager
import android.app.AppOpsManager.OPSTR_GET_USAGE_STATS
import android.app.usage.UsageEvents
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
        return "UsageStats"
    }

    @ReactMethod
    fun getUsageStats(startTime: Double, endTime: Double, promise: Promise) {
        val context: Context = reactApplicationContext
        val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

        val usageTimeOfApps: MutableMap<String, Long> = HashMap()


        usageTimeOfApps["com.whatsapp"] = 0L
        usageTimeOfApps["com.instagram.android"] = 0L
        usageTimeOfApps["com.facebook.katana"] = 0L
        usageTimeOfApps["com.twitter.android"] = 0L
        usageTimeOfApps["com.snapchat.android"] = 0L
        usageTimeOfApps["com.linkedin.android"] = 0L
        usageTimeOfApps["com.google.android.youtube"] = 0L
        usageTimeOfApps["org.telegram.messenger"] = 0L
        usageTimeOfApps["tv.twitch.android.app"] = 0L
        usageTimeOfApps["com.pinterest"] = 0L
        usageTimeOfApps["com.zhiliaoapp.musically"] = 0L

        val prev: MutableMap<String, Long> = HashMap()
        prev["com.whatsapp"] = -1L
        prev["com.instagram.android"] = -1L
        prev["com.facebook.katana"] = -1L
        prev["com.twitter.android"] = -1L
        prev["com.snapchat.android"] = -1L
        prev["com.linkedin.android"] = -1L
        prev["com.google.android.youtube"] = -1L
        prev["org.telegram.messenger"] = -1L
        prev["tv.twitch.android.app"] = -1L
        prev["com.pinterest"] = -1L
        prev["com.zhiliaoapp.musically"] = -1L



        val usageEvents: UsageEvents = usageStatsManager.queryEvents(startTime.toLong(), endTime.toLong())
        usageStatsManager.queryAndAggregateUsageStats(startTime.toLong(), endTime.toLong())
        while (usageEvents.hasNextEvent()) {
            val event = UsageEvents.Event()
            usageEvents.getNextEvent(event)
            val currPackageName = event.packageName
            if (usageTimeOfApps.containsKey(currPackageName)) {
                if (event.eventType == 1) {
                    prev[currPackageName] = event.timeStamp
                } else if (event.eventType == 2 && prev.containsKey(currPackageName) && prev[currPackageName] != -1L) {
                    val time = usageTimeOfApps[currPackageName]!! + (event.timeStamp - prev[currPackageName]!!)
                    usageTimeOfApps[currPackageName] = time
                }
            }
        }

        return promise.resolve(convertMapToWritableMap(usageTimeOfApps))
    }

    private fun convertMapToWritableMap(map: Map<String, Long>): WritableMap? {
        val result: WritableMap = WritableNativeMap()

        for (us in map) {
            if (us.value > 0) {
                val usageStats: WritableMap = WritableNativeMap()
                usageStats.putString("packageName", us.key)
                val totalTimeInSeconds = us.value / 1000
                usageStats.putDouble("totalTimeInForeground", totalTimeInSeconds.toDouble())
                result.putMap(us.key, usageStats)
            }
        }

        return result
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
