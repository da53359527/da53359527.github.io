var config = {
  "openPercent": 50, // 刮開多少百分比後, 自動清除遮罩   出廠設定值: 50
  "pensize": 15,  // 筆的大小 1 ~ 100  出廠設定值: 15
  "prizeZone": {
    "width": 80,  // 可刮區域的寬 (佔螢幕百分比 %) 出廠設定值: 80
    "height": 50  // 可刮區域的高 (佔螢幕百分比 %) 出廠設定值: 50
  },
  // 獎品池  chance: 開出機率,  img: 獎品圖片名稱(含副檔名) (ex. prize.png)
  "prize": [
    {
      "chance": 30,
      "img": "no-prize.png"
    },
    {
      "chance": 30,
      "img": "prize002.jpg"
    },
    {
      "chance": 30,
      "img": "prize003.jpg"
    },
    {
      "chance": 10,
      "img": "prize001.jpg"
      {
      "chance": 90,
      "img": "AKKE.JPG.jpg"
    }
  ]
}
