import Script from "next/script"

interface MediavineTagProps {
  tagId?: string
}

export function MediavineTag({ tagId }: MediavineTagProps) {
  if (!tagId) return null

  return (
    <>
      <link rel="dns-prefetch" href="https://scripts.mediavine.com" />
      <link rel="preconnect" href="https://scripts.mediavine.com" crossOrigin="" />
      <link rel="preconnect" href="https://securepubads.g.doubleclick.net" crossOrigin="" />
      <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="" />
      <script
        id="mediavine-preconfig"
        dangerouslySetInnerHTML={{
          __html: `
            window.$adManagementConfig = window.$adManagementConfig || {};
            try {
              var _adm = window.$adManagementConfig;
              function _sanitizeModel(m) {
                if (m && typeof m === "object") {
                  m.enable_grow = false;
                  m.enable_grow_slidebar = false;
                }
              }

              function _setupModelTrap(w) {
                if (!w || typeof w !== "object") return;
                var _m = w.model;
                if (_m) _sanitizeModel(_m);
                try {
                  Object.defineProperty(w, "model", {
                    configurable: true,
                    enumerable: true,
                    get: function() { return _m; },
                    set: function(val) {
                      _m = val;
                      _sanitizeModel(_m);
                    }
                  });
                } catch(e) {}
              }

              var _web = _adm.web || {};
              _setupModelTrap(_web);

              try {
                Object.defineProperty(_adm, "web", {
                  configurable: true,
                  enumerable: true,
                  get: function() { return _web; },
                  set: function(val) {
                    _web = val;
                    _setupModelTrap(_web);
                  }
                });
              } catch(e) {}
            } catch (e) {}
          `,
        }}
      />
      <Script
        id="mediavine-tag"
        src={`https://scripts.mediavine.com/tags/${tagId}.js`}
        strategy="afterInteractive"
        data-noptimize="1"
        data-cfasync="false"
      />
    </>
  )
}
