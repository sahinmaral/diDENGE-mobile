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
import android.os.Handler
import android.os.Looper


class UsageStatsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        private lateinit var reactContext: ReactApplicationContext
        private const val UPDATE_INTERVAL = 1000L
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
        val prev: MutableMap<String, Long> = HashMap()
        val isAppForeground: MutableMap<String, Boolean> = HashMap()

        val socialMediaApps = listOf(
            "com.whatsapp", "com.instagram.android", "com.facebook.katana",
            "com.twitter.android", "com.snapchat.android", "com.linkedin.android",
            "com.google.android.youtube", "org.telegram.messenger", "com.pinterest",
            "com.zhiliaoapp.musically"
        )

        for (packageName in socialMediaApps) {
            usageTimeOfApps[packageName] = 0L
            usageCountOfApps[packageName] = 0
            prev[packageName] = -1L
            isAppForeground[packageName] = false
        }

        val handler = Handler(Looper.getMainLooper())
        val usageEvents: UsageEvents = usageStatsManager.queryEvents(startTime.toLong(), endTime.toLong())

        while (usageEvents.hasNextEvent()) {
            val event = UsageEvents.Event()
            usageEvents.getNextEvent(event)
            val currPackageName = event.packageName
            if (usageTimeOfApps.containsKey(currPackageName)) {
                if (event.eventType == UsageEvents.Event.MOVE_TO_FOREGROUND) {
                    val count = usageCountOfApps[currPackageName] ?: 0
                    usageCountOfApps[currPackageName] = count + 1
                    prev[currPackageName] = event.timeStamp
                    isAppForeground[currPackageName] = true
                } else if (event.eventType == UsageEvents.Event.MOVE_TO_BACKGROUND) {
                    if (prev[currPackageName] != -1L) {
                        val time = usageTimeOfApps[currPackageName]!! + (event.timeStamp - prev[currPackageName]!!)
                        usageTimeOfApps[currPackageName] = time
                        prev[currPackageName] = -1L
                        isAppForeground[currPackageName] = false
                    }
                }
            }
        }

        val runnable = object : Runnable {
            override fun run() {
                val currentTime = System.currentTimeMillis()
                for (packageName in socialMediaApps) {
                    if (isAppForeground[packageName] == true && prev[packageName] != -1L) {
                        val time = usageTimeOfApps[packageName]!! + (currentTime - prev[packageName]!!)
                        usageTimeOfApps[packageName] = time
                        prev[packageName] = currentTime
                    }
                }
                handler.postDelayed(this, UPDATE_INTERVAL)
            }
        }
        handler.post(runnable)

        val result: WritableMap = WritableNativeMap()

        for (us in usageTimeOfApps) {
            if (us.value > 0) {
                val usageStats: WritableMap = WritableNativeMap()
                usageStats.putString("packageName", us.key)
                usageStats.putString("appName", getSocialMediaAppName(us.key))
                val totalTimeInSeconds = us.value / 1000
                val totalCount = usageCountOfApps[us.key] ?: 0
                usageStats.putDouble("totalTimeInForeground", totalTimeInSeconds.toDouble())
                usageStats.putInt("openCount", totalCount)
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

}
