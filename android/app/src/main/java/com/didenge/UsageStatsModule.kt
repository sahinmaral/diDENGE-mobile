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

    private fun getSocialMediaAppName(packageName: String): String {
        val socialMediaAppsMap = mapOf(
            "com.whatsapp" to "WhatsApp",
            "com.instagram.android" to "Instagram",
            "com.facebook.katana" to "Facebook",
            "com.twitter.android" to "Twitter",
            "com.snapchat.android" to "Snapchat",
            "com.linkedin.android" to "LinkedIn",
            "com.google.android.youtube" to "YouTube",
            "org.telegram.messenger" to "Telegram",
            "com.pinterest" to "Pinterest",
            "com.zhiliaoapp.musically" to "TikTok" 
        )
        return socialMediaAppsMap[packageName] ?: "Unknown App"
    }

    @ReactMethod
    fun getUsageStats(startTime: Double, endTime: Double, promise: Promise) {
        val context: Context = reactApplicationContext
        val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

        val usageTimeOfApps: MutableMap<String, Long> = HashMap()
        val usageCountOfApps: MutableMap<String, Int> = HashMap()
        val prev: MutableMap<String, Long> = HashMap() // Initialize prev map

        // Initialize usage time and count maps
        val socialMediaApps = listOf(
            "com.whatsapp", "com.instagram.android", "com.facebook.katana",
            "com.twitter.android", "com.snapchat.android", "com.linkedin.android",
            "com.google.android.youtube", "org.telegram.messenger", "com.pinterest",
            "com.zhiliaoapp.musically"
        )

        for (packageName in socialMediaApps) {
            usageTimeOfApps[packageName] = 0L
            usageCountOfApps[packageName] = 0
            prev[packageName] = -1L // Initialize prev for each app
        }

        val usageEvents: UsageEvents = usageStatsManager.queryEvents(startTime.toLong(), endTime.toLong())
        while (usageEvents.hasNextEvent()) {
            val event = UsageEvents.Event()
            usageEvents.getNextEvent(event)
            val currPackageName = event.packageName
            if (usageTimeOfApps.containsKey(currPackageName)) {
                if (event.eventType == 1) {
                    // Application opened
                    val count = usageCountOfApps[currPackageName] ?: 0
                    usageCountOfApps[currPackageName] = count + 1
                    prev[currPackageName] = event.timeStamp // Update prev for this app
                } else if (event.eventType == 2) {
                    // Application closed
                    if (prev[currPackageName] != -1L) {
                        val time = usageTimeOfApps[currPackageName]!! + (event.timeStamp - prev[currPackageName]!!)
                        usageTimeOfApps[currPackageName] = time
                    }
                }
            }
        }

        val result: WritableMap = WritableNativeMap()

        for (us in usageTimeOfApps) {
            if (us.value > 0) {
                val usageStats: WritableMap = WritableNativeMap()
                usageStats.putString("packageName", us.key)
                usageStats.putString("appName", getSocialMediaAppName(us.key))
                val totalTimeInSeconds = us.value / 1000
                val totalCount = usageCountOfApps[us.key] ?: 0
                usageStats.putDouble("totalTimeInForeground", totalTimeInSeconds.toDouble())
                usageStats.putInt("openCount", totalCount/2)
                result.putMap(us.key, usageStats)
            }
        }

        promise.resolve(result)
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
