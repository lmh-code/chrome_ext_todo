# 需要注入代码的页面连接
```
  "content_scripts": [
    {
      "matches": ["http://*/*", "https://*/*"],
      "css": ["css/popup.css"],
      "js": ["js/chunk-vendors.js"],
      "run_at": "document_idle"
    }
  ],
```