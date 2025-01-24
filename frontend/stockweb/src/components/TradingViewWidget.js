import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget({ symbols, showMiniChart = false }) {
  const containerRef = useRef(null);
  const scriptRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (scriptRef.current) {
      try {
        scriptRef.current.remove();
      } catch (error) {
        console.log("Cleanup error:", error);
      }
      scriptRef.current = null;
    }

    const script = document.createElement("script");
    script.src = showMiniChart 
      ? "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js"
      : "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;

    const config = showMiniChart ? {
      "symbol": "BSE:SENSEX",
      "width": "100%",
      "height": 150,
      "locale": "en",
      "dateRange": "1D",
      "colorTheme": "light",
      "trendLineColor": "#37a6ef",
      "underLineColor": "#E3F2FD",
      "isTransparent": false,
      "autosize": true,
      "largeChartUrl": ""
    } : {
      "symbols": symbols || [["SENSEX", "BSE:SENSEX|1D"]],
      "chartOnly": false,
      "width": "100%",
      "height": 500,
      "locale": "en",
      "colorTheme": "light",
      "autosize": true,
      "showVolume": true,
      "showMA": false,
      "hideDateRanges": false,
      "hideMarketStatus": false,
      "hideSymbolLogo": false,
      "scalePosition": "right",
      "scaleMode": "Normal",
      "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      "fontSize": "12",
      "noTimeScale": false,
      "valuesTracking": "1",
      "changeMode": "price-and-percent",
      "chartType": "area",
      "lineWidth": 2,
      "lineType": 0,
      "dateRanges": ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W", "all|1M"]
    };

    script.innerHTML = JSON.stringify(config);
    containerRef.current.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      scriptRef.current = null;
    };
  }, [symbols, showMiniChart]);

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noreferrer noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
