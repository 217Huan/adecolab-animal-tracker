/* GENKI I third edition, lessons 1–8 vocabulary tables (printed pp.38–40,
   58–59, 84–85, 104–105, 130–131, 148–149, 168–169, 188–189).
   English glosses condensed for study; no textbook scans are distributed.
   Format: reading | English meaning | optional written form. */
(function(root){
  const words=[];
  function group(lesson,pos,type,rows){
    for(const row of rows.trim().split('\n')){
      const [reading,english,written=reading]=row.split('|');
      words.push({id:`${lesson}-${words.filter(w=>w.lesson===lesson).length+1}`,lesson,pos,type,reading,english,written});
    }
  }
  group(1,'noun','名词',`
だいがく|university; college
こうこう|high school
がくせい|student
だいがくせい|college student
りゅうがくせい|international student
せんせい|teacher; professor
いちねんせい|first-year student
せんこう|major
ともだち|friend
にほんじん|Japanese person
いま|now
ごぜん|a.m.
ごご|p.m.
いちじ|one o'clock
はん|half
にじはん|half past two
にほん|Japan
アメリカ|United States
にほんご|Japanese language
でんわ|telephone
ばんごう|number
なまえ|name
イギリス|Britain
オーストラリア|Australia
かんこく|Korea
カナダ|Canada
ちゅうごく|China
インド|India
エジプト|Egypt
フィリピン|Philippines
アジアけんきゅう|Asian studies
けいざい|economics
こうがく|engineering
こくさいかんけい|international relations
コンピューター|computer
せいじ|politics
せいぶつがく|biology
ビジネス|business
ぶんがく|literature
れきし|history
いしゃ|doctor
かいしゃいん|office worker
かんごし|nurse
こうこうせい|high school student
しゅふ|housewife
だいがくいんせい|graduate student
べんごし|lawyer
おかあさん|mother
おとうさん|father
おねえさん|older sister
おにいさん|older brother
いもうと|younger sister
おとうと|younger brother`);
  group(1,'other','代词 / 疑问词',`
わたし|I
なん／なに|what`);
  group(1,'other','后缀 / 计数',`
〜ねんせい|year-of-study suffix
〜さん|Mr.; Ms.
〜じん|person of a nationality
〜じ|o'clock suffix
〜ご|language suffix
〜さい|years-old suffix
〜ばん|number suffix`);
  group(1,'other','表达',`
あのう|um; hesitation
はい|yes
そうです|that's right
そうですか|I see; is that so?`);
  group(2,'other','指示词 / 疑问词',`
これ|this one
それ|that one
あれ|that one over there
どれ|which one
この|this (before a noun)
その|that (before a noun)
あの|that over there (before a noun)
どの|which (before a noun)
ここ|here
そこ|there
あそこ|over there
どこ|where
だれ|who
いくら|how much`);
  group(2,'adjective','い形容词',`
おいしい|delicious
たかい|expensive; high`);
  group(2,'noun','名词',`
さかな|fish
とんかつ|pork cutlet
にく|meat
メニュー|menu
やさい|vegetable
かさ|umbrella
かばん|bag
くつ|shoes
さいふ|wallet
ジーンズ|jeans
じてんしゃ|bicycle
しんぶん|newspaper
スマホ|smartphone
Ｔシャツ|T-shirt
とけい|watch; clock
ノート|notebook
ペン|pen
ぼうし|hat; cap
ほん|book
ぎんこう|bank
コンビニ|convenience store
トイレ|restroom; toilet
としょかん|library
ゆうびんきょく|post office
イギリス|Britain
かんこく|Korea
ちゅうごく|China
えいご|English language
けいざい|economics
コンピューター|computer
ビジネス|business
れきし|history
おかあさん|mother
おとうさん|father`);
  group(2,'other','表达 / 后缀',`
〜えん|yen suffix
いらっしゃいませ|welcome to our store
おねがいします|please (a request)
ください|please give me
じゃあ|then; in that case
どうぞ|please; here you are
どうも|thank you`);
  group(3,'noun','名词',`
えいが|movie|映画
おんがく|music|音楽
ざっし|magazine|雑誌
スポーツ|sports
デート|romantic date
テニス|tennis
テレビ|television
アイスクリーム|ice cream
ハンバーガー|hamburger
おさけ|alcoholic drink; sake|お酒
おちゃ|green tea|お茶
コーヒー|coffee
みず|water|水
あさごはん|breakfast|朝ご飯
ひるごはん|lunch|昼ご飯
ばんごはん|dinner|晩ご飯
いえ|house; home|家
うち|home; my place
がっこう|school|学校
カフェ|cafe
あした|tomorrow|明日
きょう|today|今日
あさ|morning|朝
こんばん|tonight|今晩
まいにち|every day|毎日
まいばん|every night|毎晩
しゅうまつ|weekend|週末
どようび|Saturday|土曜日
にちようび|Sunday|日曜日`);
  group(3,'verb','う动词',`
いく|to go|行く
かえる|to return; go back|帰る
きく|to listen; hear|聞く
のむ|to drink|飲む
はなす|to speak; talk|話す
よむ|to read|読む`);
  group(3,'verb','る动词',`
おきる|to get up|起きる
たべる|to eat|食べる
ねる|to sleep|寝る
みる|to see; watch|見る`);
  group(3,'verb','不规则动词',`
くる|to come|来る
する|to do
べんきょうする|to study|勉強する`);
  group(3,'adjective','い形容词',`
いい|good
はやい|early|早い`);
  group(3,'other','副词 / 表达',`
いつ|when
〜ごろ|at about (a time)
あまり|not much (with a negative)
ぜんぜん|not at all (with a negative)|全然
たいてい|usually
ちょっと|a little
ときどき|sometimes|時々
よく|often; much
そうですね|that's right; let me see
でも|but
どうですか|how about; how is it?
ええ|yes`);
  group(4,'noun','名词',`
ゲーム|game
アルバイト|part-time job
かいもの|shopping|買い物
クラス|class
いぬ|dog|犬
ねこ|cat|猫
ひと|person|人
こども|child|子供
いす|chair
つくえ|desk|机
しゃしん|photograph|写真
はな|flower|花
レポート|term paper
ごはん|rice; meal|ご飯
パン|bread
おてら|temple|お寺
こうえん|park|公園
スーパー|supermarket
バスてい|bus stop|バス停
びょういん|hospital|病院
ホテル|hotel
ほんや|bookstore|本屋
まち|town; city|町
レストラン|restaurant
きのう|yesterday|昨日
いちじかん|one hour|一時間
せんしゅう|last week|先週
とき|when; at the time of|時
げつようび|Monday|月曜日
かようび|Tuesday|火曜日
すいようび|Wednesday|水曜日
もくようび|Thursday|木曜日
きんようび|Friday|金曜日`);
  group(4,'verb','う动词',`
あう|to meet a person|会う
ある|to exist (things)
かう|to buy|買う
かく|to write|書く
とる|to take a photograph|撮る
まつ|to wait|待つ
わかる|to understand`);
  group(4,'verb','る动词',`
いる|to exist; stay (people)`);
  group(4,'other','代词 / 副词 / 表达',`
あなた|you
〜じかん|hours suffix|〜時間
〜ぐらい|about (an approximate amount)
ごめんなさい|I'm sorry
それから|and then
だから|so; therefore
たくさん|many; a lot
〜と|together with; and
どうして|why
ひとりで|alone|一人で
もしもし|hello (on the phone)`);
  group(5,'noun','名词',`
たべもの|food|食べ物
のみもの|drink|飲み物
くだもの|fruit|果物
やすみ|holiday; day off; absence|休み
りょこう|travel|旅行
うみ|sea|海
サーフィン|surfing
おみやげ|souvenir|お土産
バス|bus
てんき|weather|天気
しゅくだい|homework|宿題
テスト|test
たんじょうび|birthday|誕生日
へや|room|部屋
Ｌサイズ|size L`);
  group(5,'adjective','い形容词',`
あたらしい|new|新しい
ふるい|old (things)|古い
あつい|hot (weather)|暑い
さむい|cold (weather)|寒い
あつい|hot (things)|熱い
いそがしい|busy|忙しい
おおきい|large|大きい
ちいさい|small|小さい
おもしろい|interesting; funny|面白い
つまらない|boring
やさしい|easy; kind
むずかしい|difficult|難しい
かっこいい|good-looking
こわい|frightening|怖い
たのしい|fun|楽しい
やすい|inexpensive|安い`);
  group(5,'adjective','な形容词',`
すき|fond of; to like|好き
きらい|disgusted with; to dislike|嫌い
だいすき|very fond of; to love|大好き
だいきらい|to hate|大嫌い
きれい|beautiful; clean
げんき|healthy; energetic|元気
しずか|quiet|静か
にぎやか|lively
ひま|free (time); not busy|暇`);
  group(5,'verb','う动词',`
およぐ|to swim|泳ぐ
きく|to ask|聞く
のる|to ride; board|乗る
やる|to do; perform`);
  group(5,'verb','る动词',`
でかける|to go out|出かける`);
  group(5,'other','代词 / 副词 / 表达',`
ぼく|I (used by men)|僕
いっしょに|together|一緒に
すごく|extremely
だいじょうぶ|it's okay; not to worry|大丈夫
とても|very
どんな|what kind of
〜まい|counter for flat objects|〜枚`);
  group(6,'noun','名词',`
かんじ|kanji; Chinese character|漢字
きょうかしょ|textbook|教科書
ページ|page
つぎ|next|次
おかね|money|お金
にもつ|baggage|荷物
パソコン|personal computer
シャワー|shower
エアコン|air conditioner
でんき|electricity; light|電気
まど|window|窓
でんしゃ|train|電車
くに|country; place of origin|国
こんしゅう|this week|今週
らいしゅう|next week|来週
らいねん|next year|来年
よる|night|夜`);
  group(6,'adjective','な形容词',`
たいへん|tough (situation)|大変`);
  group(6,'verb','う动词',`
あそぶ|to play; spend time pleasantly|遊ぶ
いそぐ|to hurry|急ぐ
かえす|to return a thing|返す
けす|to turn off; erase|消す
しぬ|to die|死ぬ
すわる|to sit down|座る
たつ|to stand up|立つ
たばこをすう|to smoke|たばこを吸う
つかう|to use|使う
てつだう|to help|手伝う
はいる|to enter|入る
もつ|to carry; hold|持つ
やすむ|to be absent; rest|休む`);
  group(6,'verb','る动词',`
あける|to open something|開ける
しめる|to close something|閉める
おしえる|to teach|教える
わすれる|to forget; leave behind|忘れる
おりる|to get off|降りる
かりる|to borrow|借りる
シャワーをあびる|to take a shower|シャワーを浴びる
つける|to turn on`);
  group(6,'verb','不规则动词',`
でんわする|to call|電話する
つれてくる|to bring a person|連れてくる
もってくる|to bring a thing|持ってくる`);
  group(6,'other','副词 / 表达',`
あとで|later on|後で
すぐ|right away
ゆっくり|slowly; leisurely
けっこうです|that would be fine; no thank you|結構です
ほんとうですか|really?|本当ですか`);
  group(7,'noun','名词',`
かぞく|family|家族
おじいさん|grandfather; old man
おばあさん|grandmother; old woman
おにいさん|older brother|お兄さん
おねえさん|older sister|お姉さん
ちち|my father|父
はは|my mother|母
あに|my older brother|兄
あね|my older sister|姉
いもうと|younger sister|妹
おとうと|younger brother|弟
きょうだい|brothers and sisters|兄弟
おとこのひと|man|男の人
おんなのひと|woman|女の人
かいしゃ|company|会社
しょくどう|cafeteria|食堂
デパート|department store
かみ|hair|髪
くち|mouth|口
め|eye|目
めがね|glasses|眼鏡
うた|song|歌
サークル|club activity
くるま|car|車`);
  group(7,'adjective','い形容词',`
ながい|long|長い
みじかい|short (length)|短い
はやい|fast|速い
せがたかい|tall (stature)|背が高い
せがひくい|short (stature)|背が低い
あたまがいい|smart; clever|頭がいい
かわいい|cute`);
  group(7,'adjective','な形容词',`
しんせつ|kind|親切
べんり|convenient|便利`);
  group(7,'verb','う动词',`
うたう|to sing|歌う
かぶる|to put on a hat
はく|to put on items below the waist
しる|to get to know|知る
すむ|to live|住む
はたらく|to work|働く
ふとる|to gain weight|太る`);
  group(7,'verb','る动词',`
かける|to put on glasses
きる|to put on clothes above the waist|着る
やせる|to lose weight`);
  group(7,'verb','不规则动词',`
けっこんする|to get married|結婚する`);
  group(7,'verb','动词表达',`
しっています|I know|知っています
しりません|I do not know|知りません
ふとっています|to be overweight|太っています
やせています|to be thin`);
  group(7,'other','副词 / 表达 / 计数',`
〜が|but (clause ending)
なにも|not anything (with a negative)|何も
〜にん|counter for people|〜人
ひとり|one person|一人
ふたり|two people|二人
べつに|nothing in particular (with a negative)|別に
もちろん|of course
よかったら|if you like`);
  group(8,'noun','名词',`
はれ|sunny weather|晴れ
あめ|rain|雨
くもり|cloudy weather|曇り
ゆき|snow|雪
てんきよほう|weather forecast|天気予報
きおん|temperature (weather)|気温
なつ|summer|夏
ふゆ|winter|冬
けさ|this morning|今朝
あさって|the day after tomorrow
まいしゅう|every week|毎週
こんげつ|this month|今月
らいげつ|next month|来月
かいしゃいん|office worker|会社員
しごと|job; work; occupation|仕事
カメラ|camera
カラオケ|karaoke
ところ|place|所
トマト|tomato
はし|chopsticks
パーティー|party
バーベキュー|barbecue
ホームステイ|homestay
おふろ|bath|お風呂
スペイン|Spain`);
  group(8,'adjective','な形容词',`
じょうず|skillful; good at|上手
へた|clumsy; poor at|下手
ゆうめい|famous|有名`);
  group(8,'verb','う动词',`
あらう|to wash|洗う
いう|to say|言う
いる|to need|要る
おそくなる|to be late|遅くなる
おふろにはいる|to take a bath|お風呂に入る
おもう|to think|思う
きる|to cut|切る
つくる|to make|作る
ふる|rain or snow falls|降る
もっていく|to take a thing|持っていく`);
  group(8,'verb','る动词',`
すてる|to throw away|捨てる
はじめる|to begin|始める`);
  group(8,'verb','不规则动词',`
うんてんする|to drive|運転する
せんたくする|to do laundry|洗濯する
そうじする|to clean|掃除する
りょうりする|to cook|料理する`);
  group(8,'other','代词 / 副词 / 表达',`
なにか|something|何か
うん|yes (informal)
ううん|no (informal)
いつも|always
おそく|late (doing something)|遅く
かんぱい|cheers (a toast)|乾杯
みんなで|all together
ざんねん|that's too bad|残念
まだ|not yet (with a negative)
〜について|about; concerning
〜ど|degrees (temperature)|〜度
どう|how`);
  // Explicit variants only: do not remove arbitrary kana or punctuation from answers.
  const variants={ 'なん／なに':['なん','なに'], 'Ｔシャツ':['ティーシャツ'], 'Ｌサイズ':['エルサイズ'],
    'おねがいします':['をおねがいします'], 'ください':['をください'],
    'かける':['めがねをかける','眼鏡をかける'], 'ふる':['あめがふる','雨が降る','ゆきがふる','雪が降る'],
    'ざんねん':['ざんねんですね','残念ですね'] };
  words.forEach(w=>{w.answers=[...new Set([w.reading,w.written,...(variants[w.reading]||[])])];if(w.type==='な形容词')w.answers.push(w.reading+'な',w.written+'な');});
  const data={words,lessons:['New Friends','Shopping','Making a Date','The First Date','A Trip to Okinawa',"A Day in Robert’s Life",'Family Picture','Barbecue']};
  if(typeof module!=='undefined')module.exports=data;else root.JapaneseVocabulary=data;
})(typeof globalThis!=='undefined'?globalThis:this);
