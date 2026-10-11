import Script from "next/script"

interface MediavineTagProps {
  tagId?: string
}

export function MediavineTag({ tagId }: MediavineTagProps) {
  if (!tagId) return null

  return (
    <>
      <link rel="dns-prefetch" href="https://scripts.mediavine.com" />
      <script
        id="mediavine-preconfig"
        dangerouslySetInnerHTML={{
          __html: `
            window.$adManagementConfig = window.$adManagementConfig || {};
            try {
              var _adm = window.$adManagementConfig;
              function _applyGrowOptOut(target) {
                if (target && target.web && target.web.model) {
                  target.web.model.enable_grow = false;
                  target.web.model.enable_grow_slidebar = false;
                }
              }
              Object.defineProperty(window, '$adManagementConfig', {
                configurable: true,
                enumerable: true,
                get: function() { return _adm; },
                set: function(val) {
                  _adm = val;
                  _applyGrowOptOut(_adm);
                }
              });
              _applyGrowOptOut(_adm);
            } catch (e) {}
          `,
        }}
      />
      <Script
        id="mediavine-tag"
        src={`https://scripts.mediavine.com/tags/${tagId}.js`}
        strategy="lazyOnload"
        data-noptimize="1"
        data-cfasync="false"
      />
    </>
  )
}
