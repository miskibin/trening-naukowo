package pl.trening.naukowo;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.ViewGroup;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import android.widget.FrameLayout;

public final class MainActivity extends Activity {
    private static final String START_URL = "file:///android_asset/index.html";
    private static final String ASSET_ROOT = "file:///android_asset/";

    private WebView webView;
    private FrameLayout contentContainer;
    private Object backCallback;
    private boolean checkingBack;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (BuildConfig.DEBUG) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        configureSystemBars();

        webView = new WebView(this);
        webView.setBackgroundColor(Color.WHITE);
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setAllowContentAccess(false);
        settings.setSupportMultipleWindows(false);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (!request.isForMainFrame()) {
                    return false;
                }
                return handleNavigation(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleNavigation(Uri.parse(url));
            }
        });

        contentContainer = new FrameLayout(this);
        contentContainer.setBackgroundColor(Color.WHITE);
        contentContainer.addView(webView, new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));
        contentContainer.setOnApplyWindowInsetsListener((view, insets) -> {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                Api30.applySafeAndImeInsets(view, insets);
            } else {
                view.setPadding(
                    insets.getSystemWindowInsetLeft(),
                    insets.getSystemWindowInsetTop(),
                    insets.getSystemWindowInsetRight(),
                    insets.getSystemWindowInsetBottom()
                );
            }
            return insets;
        });

        setContentView(contentContainer);
        contentContainer.requestApplyInsets();
        webView.loadUrl(START_URL);

        if (Build.VERSION.SDK_INT >= 33) {
            backCallback = Api33.registerBackCallback(this, this::handleBack);
        }
    }

    private void configureSystemBars() {
        Window window = getWindow();
        window.setStatusBarColor(Color.WHITE);
        window.setNavigationBarColor(Color.WHITE);
        window.getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
        );
        if (Build.VERSION.SDK_INT >= 29) {
            Api29.disableBarContrastEnforcement(window);
        }
    }

    private boolean handleNavigation(Uri uri) {
        String url = uri.toString();
        if (url.startsWith(ASSET_ROOT) || "about:blank".equals(url)) {
            return false;
        }

        if ("https".equalsIgnoreCase(uri.getScheme())) {
            try {
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
            } catch (ActivityNotFoundException exception) {
                Toast.makeText(this, "Brak aplikacji do otwarcia tego linku.", Toast.LENGTH_SHORT).show();
            }
        }
        // Keep navigation inside the packaged offline site; open only HTTPS links externally.
        return true;
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        handleBack();
    }

    private void handleBack() {
        WebView current = webView;
        if (current == null || checkingBack) {
            return;
        }

        checkingBack = true;
        current.evaluateJavascript(
            "(function(){try{return typeof window.appBack === 'function' && window.appBack() === true;}catch(e){return false;}})();",
            result -> {
                checkingBack = false;
                if (isFinishing() || isDestroyed() || current != webView) {
                    return;
                }
                if (!"true".equals(result)) {
                    if (current.canGoBack()) {
                        current.goBack();
                    } else {
                        finish();
                    }
                }
            }
        );
    }

    @Override
    protected void onDestroy() {
        if (backCallback != null && Build.VERSION.SDK_INT >= 33) {
            Api33.unregisterBackCallback(this, backCallback);
            backCallback = null;
        }
        if (webView != null) {
            webView.stopLoading();
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }

    private static final class Api29 {
        private Api29() { }

        static void disableBarContrastEnforcement(Window window) {
            window.setStatusBarContrastEnforced(false);
            window.setNavigationBarContrastEnforced(false);
        }
    }

    private static final class Api30 {
        private Api30() { }

        static void applySafeAndImeInsets(View view, WindowInsets insets) {
            android.graphics.Insets safeInsets = insets.getInsets(
                WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout()
            );
            android.graphics.Insets imeInsets = insets.getInsets(WindowInsets.Type.ime());
            view.setPadding(
                safeInsets.left,
                safeInsets.top,
                safeInsets.right,
                Math.max(safeInsets.bottom, imeInsets.bottom)
            );
        }
    }

    private static final class Api33 {
        private Api33() { }

        static Object registerBackCallback(Activity activity, Runnable action) {
            android.window.OnBackInvokedCallback callback = action::run;
            activity.getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,
                callback
            );
            return callback;
        }

        static void unregisterBackCallback(Activity activity, Object callback) {
            activity.getOnBackInvokedDispatcher().unregisterOnBackInvokedCallback(
                (android.window.OnBackInvokedCallback) callback
            );
        }
    }
}
