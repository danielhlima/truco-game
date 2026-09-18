package com.trucoraiz.game;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.net.Uri;
import androidx.annotation.NonNull;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;

import java.util.ArrayList;
import java.util.List;

@CapacitorPlugin(name = "TrucoAds")
public class TrucoAdsPlugin extends Plugin {
    private static final String PRIVACY_POLICY_URL =
        "https://danielhenriquelima.com.br/truco-raiz/privacidade/";
    private static final String SUPPORT_URL =
        "https://danielhenriquelima.com.br/truco-raiz/suporte/";

    private InterstitialAd interstitialAd;
    private ConsentInformation consentInformation;
    private boolean consentRequestInProgress = false;
    private boolean consentRequestCompleted = false;
    private boolean mobileAdsInitializationStarted = false;
    private boolean sdkInitialized = false;
    private boolean isLoading = false;
    private boolean privacyOptionsFormShowing = false;
    private final List<PluginCall> pendingInitializationCalls = new ArrayList<>();

    @PluginMethod
    public void isDebugBuild(PluginCall call) {
        JSObject result = new JSObject();
        boolean isDebuggable =
            (getContext().getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
        result.put("enabled", isDebuggable);
        call.resolve(result);
    }

    @PluginMethod
    public void initialize(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (consentRequestCompleted) {
                resolveStatus(call);
                return;
            }

            pendingInitializationCalls.add(call);
            if (consentRequestInProgress) return;

            consentRequestInProgress = true;
            consentInformation = UserMessagingPlatform.getConsentInformation(getContext());
            ConsentRequestParameters params = new ConsentRequestParameters.Builder().build();

            consentInformation.requestConsentInfoUpdate(
                getActivity(),
                params,
                () -> {
                    maybeInitializeMobileAds();
                    UserMessagingPlatform.loadAndShowConsentFormIfRequired(
                        getActivity(),
                        formError -> finishConsentRequest()
                    );
                },
                requestConsentError -> {
                    maybeInitializeMobileAds();
                    finishConsentRequest();
                }
            );
        });
    }

    @PluginMethod
    public void preloadInterstitial(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (!sdkInitialized || !canRequestAds()) {
                interstitialAd = null;
                resolveStatus(call);
                return;
            }

            if (interstitialAd != null || isLoading) {
                resolveStatus(call);
                return;
            }

            isLoading = true;
            InterstitialAd.load(
                getContext(),
                getContext().getString(com.trucoraiz.game.R.string.admob_interstitial_ad_unit_id),
                new AdRequest.Builder().build(),
                new InterstitialAdLoadCallback() {
                    @Override
                    public void onAdLoaded(@NonNull InterstitialAd ad) {
                        isLoading = false;
                        interstitialAd = ad;
                        notifyAdEvent("adLoaded", null);
                        resolveStatus(call);
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError error) {
                        isLoading = false;
                        interstitialAd = null;
                        JSObject data = new JSObject();
                        data.put("code", error.getCode());
                        data.put("message", error.getMessage());
                        notifyListeners("adFailedToLoad", data);
                        resolveStatus(call);
                    }
                }
            );
        });
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        resolveStatus(call);
    }

    @PluginMethod
    public void showPrivacyOptions(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (!isPrivacyOptionsRequired() || privacyOptionsFormShowing) {
                resolveStatus(call);
                return;
            }

            privacyOptionsFormShowing = true;
            UserMessagingPlatform.showPrivacyOptionsForm(getActivity(), formError -> {
                privacyOptionsFormShowing = false;
                if (!canRequestAds()) {
                    interstitialAd = null;
                }
                maybeInitializeMobileAds();
                JSObject response = status(false);
                if (formError != null) {
                    response.put("errorCode", formError.getErrorCode());
                    response.put("errorMessage", formError.getMessage());
                }
                call.resolve(response);
            });
        });
    }

    @PluginMethod
    public void openPrivacyPolicy(PluginCall call) {
        openExternalUrl(call, PRIVACY_POLICY_URL);
    }

    @PluginMethod
    public void openSupport(PluginCall call) {
        openExternalUrl(call, SUPPORT_URL);
    }

    @PluginMethod
    public void showInterstitial(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (!canRequestAds() || interstitialAd == null) {
                interstitialAd = null;
                call.resolve(status(false));
                return;
            }

            InterstitialAd adToShow = interstitialAd;
            interstitialAd = null;
            adToShow.setFullScreenContentCallback(new FullScreenContentCallback() {
                @Override
                public void onAdShowedFullScreenContent() {
                    notifyAdEvent("adShown", null);
                }

                @Override
                public void onAdDismissedFullScreenContent() {
                    notifyAdEvent("adDismissed", null);
                }

                @Override
                public void onAdFailedToShowFullScreenContent(@NonNull AdError error) {
                    JSObject data = new JSObject();
                    data.put("code", error.getCode());
                    data.put("message", error.getMessage());
                    notifyListeners("adFailedToShow", data);
                }
            });

            adToShow.show(getActivity());
            JSObject response = status(true);
            response.put("shown", true);
            call.resolve(response);
        });
    }

    private void resolveStatus(PluginCall call) {
        call.resolve(status(false));
    }

    private void finishConsentRequest() {
        consentRequestInProgress = false;
        consentRequestCompleted = true;
        maybeInitializeMobileAds();

        if (consentInformation != null && consentInformation.canRequestAds() && !sdkInitialized) {
            return;
        }

        resolvePendingInitializationCalls();
    }

    private void resolvePendingInitializationCalls() {
        List<PluginCall> calls = new ArrayList<>(pendingInitializationCalls);
        pendingInitializationCalls.clear();
        for (PluginCall pendingCall : calls) {
            resolveStatus(pendingCall);
        }
    }

    private void maybeInitializeMobileAds() {
        if (!canRequestAds() || mobileAdsInitializationStarted) {
            return;
        }

        mobileAdsInitializationStarted = true;
        MobileAds.initialize(getContext(), initializationStatus -> {
            sdkInitialized = true;
            JSObject data = status(false);
            notifyListeners("sdkInitialized", data);
            if (consentRequestCompleted) {
                resolvePendingInitializationCalls();
            }
        });
    }

    private boolean isPrivacyOptionsRequired() {
        return consentInformation != null
            && consentInformation.getPrivacyOptionsRequirementStatus()
                == ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED;
    }

    private boolean canRequestAds() {
        return consentInformation != null && consentInformation.canRequestAds();
    }

    private void openExternalUrl(PluginCall call, String url) {
        getActivity().runOnUiThread(() -> {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                getActivity().startActivity(intent);
                call.resolve();
            } catch (ActivityNotFoundException error) {
                call.reject("No browser is available to open this link", error);
            }
        });
    }

    private JSObject status(boolean shown) {
        JSObject response = new JSObject();
        response.put("initialized", sdkInitialized);
        response.put("loading", isLoading);
        response.put("ready", interstitialAd != null);
        response.put("shown", shown);
        response.put("privacyOptionsRequired", isPrivacyOptionsRequired());
        return response;
    }

    private void notifyAdEvent(String name, JSObject data) {
        notifyListeners(name, data == null ? new JSObject() : data);
    }
}
