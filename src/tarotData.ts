export interface TarotCard {
  id: number;
  name: string;
  image: string;
  meaning: string;
  interpretation: string;
}

export const tarotCards: TarotCard[] = [
  {
    id: 0,
    name: "Mecnun (The Fool)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar00.jpg",
    meaning: "Yeni başlangıçlar, masumiyet, macera.",
    interpretation: "Hayatınızda yeni bir sayfa açılıyor. Risk almaktan korkmayın, evren sizi destekliyor."
  },
  {
    id: 1,
    name: "Büyücü (The Magician)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar01.jpg",
    meaning: "Yaratıcılık, beceri, irade gücü.",
    interpretation: "İhtiyacınız olan tüm araçlara sahipsiniz. Odaklanın ve hayallerinizi gerçeğe dönüştürün."
  },
  {
    id: 2,
    name: "Azize (The High Priestess)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar02.jpg",
    meaning: "Sezgi, gizem, içsel bilgi.",
    interpretation: "Mantığınızdan ziyade sezgilerinize güvenme zamanı. Sırlar yakında açığa çıkacak."
  },
  {
    id: 3,
    name: "İmparatoriçe (The Empress)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar03.jpg",
    meaning: "Bolluk, doğurganlık, doğa.",
    interpretation: "Yaratıcı enerjiniz zirvede. Çevrenizdeki güzelliklerin tadını çıkarın ve besleyici olun."
  },
  {
    id: 4,
    name: "İmparator (The Emperor)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar04.jpg",
    meaning: "Otorite, yapı, kontrol.",
    interpretation: "Disiplin ve düzen getirme zamanı. Liderlik özelliklerinizi kullanın."
  },
  {
    id: 5,
    name: "Aziz (The Hierophant)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar05.jpg",
    meaning: "Gelenek, inanç, ruhsal rehberlik.",
    interpretation: "Geleneksel yolları izlemek veya bir rehberden yardım almak size iyi gelecektir."
  },
  {
    id: 6,
    name: "Aşıklar (The Lovers)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar06.jpg",
    meaning: "Aşk, uyum, seçimler.",
    interpretation: "İlişkilerinizde önemli bir karar aşamasındasınız. Kalbinizin sesini dinleyin."
  },
  {
    id: 7,
    name: "Araba (The Chariot)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar07.jpg",
    meaning: "Zafer, irade, kararlılık.",
    interpretation: "Zorlukların üstesinden gelmek için gereken güce sahipsiniz. Hedefinize odaklanın."
  },
  {
    id: 8,
    name: "Güç (Strength)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar08.jpg",
    meaning: "Cesaret, sabır, içsel güç.",
    interpretation: "Kaba kuvvetle değil, şefkat ve sabırla kazanan siz olacaksınız."
  },
  {
    id: 9,
    name: "Ermiş (The Hermit)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar09.jpg",
    meaning: "İçe dönüş, yalnızlık, bilgelik.",
    interpretation: "Cevaplar dışarıda değil, içeride. Biraz yalnız kalıp düşünmek size ışık tutacak."
  },
  {
    id: 10,
    name: "Kader Çarkı (Wheel of Fortune)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar10.jpg",
    meaning: "Şans, değişim, döngüler.",
    interpretation: "Şans sizden yana dönüyor. Hayatın akışına güvenin, değişim kaçınılmazdır."
  },
  {
    id: 11,
    name: "Adalet (Justice)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar11.jpg",
    meaning: "Denge, dürüstlük, sebep-sonuç.",
    interpretation: "Ektiğinizi biçiyorsunuz. Adil olun ve kararlarınızın sorumluluğunu alın."
  },
  {
    id: 12,
    name: "Asılan Adam (The Hanged Man)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar12.jpg",
    meaning: "Fedakarlık, yeni bakış açısı, duraklama.",
    interpretation: "Bazen ilerlemek için durmak gerekir. Olaylara farklı bir pencereden bakmayı deneyin."
  },
  {
    id: 13,
    name: "Ölüm (Death)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar13.jpg",
    meaning: "Sonlanma, dönüşüm, yeni başlangıç.",
    interpretation: "Korkmayın, bu fiziksel bir ölüm değil. Hayatınızda artık size hizmet etmeyen bir şey sona eriyor."
  },
  {
    id: 14,
    name: "Denge (Temperance)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar14.jpg",
    meaning: "Denge, sabır, uyum.",
    interpretation: "Aşırılıklardan kaçının. Hayatınızın farklı alanlarını uyum içine getirme zamanı."
  },
  {
    id: 15,
    name: "Şeytan (The Devil)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar15.jpg",
    meaning: "Bağımlılık, hırs, kısıtlanma.",
    interpretation: "Sizi engelleyen zincirlerin farkına varın. Kendi yarattığınız hapishaneden çıkma gücü sizde."
  },
  {
    id: 16,
    name: "Yıkılan Kule (The Tower)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar16.jpg",
    meaning: "Ani değişim, kaos, aydınlanma.",
    interpretation: "Sarsıcı bir olay yaşanabilir ancak bu, çürük temellerin yıkılıp daha sağlam bir gelecek kurulması içindir."
  },
  {
    id: 17,
    name: "Yıldız (The Star)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar17.jpg",
    meaning: "Umut, ilham, yenilenme.",
    interpretation: "Karanlık günler geride kalıyor. Geleceğe umutla bakın, dilekleriniz gerçekleşebilir."
  },
  {
    id: 18,
    name: "Ay (The Moon)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar18.jpg",
    meaning: "İllüzyon, korku, bilinçaltı.",
    interpretation: "Görünene aldanmayın. Korkularınızla yüzleşin ve sezgilerinizin rehberliğine güvenin."
  },
  {
    id: 19,
    name: "Güneş (The Sun)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar19.jpg",
    meaning: "Başarı, mutluluk, canlılık.",
    interpretation: "Hayatınızda en parlak dönemlerinden birindesiniz. Her şey yolunda gidecek, tadını çıkarın."
  },
  {
    id: 20,
    name: "Mahkeme (Judgement)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar20.jpg",
    meaning: "Yargılama, yeniden doğuş, içsel çağrı.",
    interpretation: "Geçmişi değerlendirme ve yeni bir hayata uyanma zamanı. Kendinizi affedin ve ilerleyin."
  },
  {
    id: 21,
    name: "Dünya (The World)",
    image: "https://www.sacred-texts.com/tarot/pkt/img/ar21.jpg",
    meaning: "Tamamlanma, bütünlük, başarı.",
    interpretation: "Bir döngü başarıyla tamamlandı. Dünyanın size sunduğu tüm güzellikleri kucaklayın."
  }
];
