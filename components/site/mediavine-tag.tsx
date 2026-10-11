import Script from "next/script"

interface MediavineTagProps {
  tagId?: string
}

export function MediavineTag({ tagId }: MediavineTagProps) {
  if (!tagId) return null

  return (
    <>
      <script
        id="mediavine-preconfig"
        dangerouslySetInnerHTML={{
          __html: `
            window.$adManagementConfig = window.$adManagementConfig || {};
            try {
              var _adm = window.$adManagementConfig;
              Object.defineProperty(window, '$adManagementConfig', {
                configurable: true,
                enumerable: true,
                get: function() { return _adm; },
                set: function(val) {
                  _adm = val;
                  if (_adm && _adm.web && _adm.web.model) {
                    _adm.web.model.enable_grow_slidebar = false;
                  }
                }
              });
              if (_adm && _adm.web && _adm.web.model) {
                _adm.web.model.enable_grow_slidebar = false;
              }
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
