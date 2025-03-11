把当前我的数据中，所有的title和description和path和key列出来，生成一个好看的卡片式的列表。只给我返回html的内容，其他的东西不返回给我。

```json
[
  {
    "command": "logout",
    "route": {
      "path": "user",
      "key": "logout",
      "description": "退出登录",
      "metadata": {
        "command": "logout"
      },
      "validator": {}
    }
  },
  {
    "command": "command-list",
    "route": {
      "path": "command",
      "key": "list",
      "description": "命令列表",
      "metadata": {
        "command": "command-list",
        "prompt": "把当前我的数据中，所有命令列表返回"
      },
      "validator": {
        "commands": {
          "type": "any",
          "required": false
        }
      }
    }
  }
]
```
