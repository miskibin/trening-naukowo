# Budowanie aplikacji Android

Aplikacja używa natywnej powłoki Java i lokalnych plików WebView. APK powstaje bez Gradle i bez pobierania zależności. Wymaga zainstalowanego JDK 17 oraz Android SDK z platformą Android 35 lub nowszą i narzędziami `aapt2`, `d8`, `zipalign` oraz `apksigner`.

Z katalogu głównego projektu uruchom:

```powershell
.\build.ps1
```

Wynik trafia do `android\build\TreningNaukowo.apk`. Skrypt podpisuje go lokalnym kluczem debug przeznaczonym do instalacji na własnym urządzeniu. Debugowanie zawartości WebView jest domyślnie wyłączone; włączysz je przełącznikiem `-EnableWebViewDebug`.

Domyślny target SDK to najwyższy lokalnie dostępny poziom nieprzekraczający API 35, a minimalny SDK to API 26. Można wskazać inną lokalnie zainstalowaną platformę przez `-TargetSdk` albo SDK przez `-SdkRoot`.

Zawartość offline umieszczaj w `android\app\src\main\assets\`, zaczynając od `index.html`. WebView ma włączone JavaScript i localStorage; do otwierania zewnętrznych odnośników używa przeglądarki systemowej. Aplikacja nie żąda uprawnień sieciowych ani dostępu do plików użytkownika.
