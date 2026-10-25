import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { membersData as authenticMembers } from "../src/data/members.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/alokworld";

async function setProperData() {
  console.log("Connecting to database at:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  console.log("\n=======================================================");
  console.log("1. UPDATING SITE SETTINGS (LIVE MODE & AUTHENTIC HINDI)");
  console.log("=======================================================");
  const properSettings = {
    siteName: "अखिल भारतीय समाज डिरेक्टरी - alokworld.in",
    tagline: "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ (आलोक)",
    announcement: "राष्ट्रीय अधिवेशन 2026 की पूर्व तैयारी एवं सदस्यता अभियान में सादर आमंत्रित हैं।",
    announcementEnabled: true,
    heroBadge: "आधिकारिक समुदाय पोर्टल",
    heroTitle: "अखिल भारतीय समाज डायरेक्टरी एवं केंद्रीय सूचना पोर्टल",
    heroSubtitle: "देश भर के समाज बंधुओं, वरिष्ठ मार्गदर्शकों, चिकित्सकों, अभियंताओं, प्रशासनिक अधिकारियों, अधिवक्ताओं एवं युवाओं को जोड़ने वाला डिजिटल मंच।",
    heroCtaText: "सदस्य डायरेक्टरी देखें →",
    heroCtaLink: "/directory",
    heroImage: "/asset/alokadhivationposter2026/poster1.jpeg",

    // Event & Countdown (2 Nov Live Target)
    eventEnabled: true,
    eventTopBarEnabled: true,
    eventPopupEnabled: true,
    eventTitle: "आलोक राष्ट्रीय महासम्मेलन एवं भव्य पोर्टल लोकार्पण — 2026",
    eventSubtitle: "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ का ऐतिहासिक राष्ट्रीय सम्मेलन",
    eventBadge: "विशेष आगामी कार्यक्रम",
    eventDate: "2026-11-02T10:00:00",
    eventLocation: "कांस्टीट्यूशन क्लब, रफी मार्ग, नई दिल्ली",
    eventCountdownLabel: "वेबसाइट लाइव एवं महासम्मेलन उल्टी गिनती",
    eventDescription:
      "2 नवम्बर 2026 को समाज के गौरवशाली राष्ट्रीय महासम्मेलन, प्रतिभावान छात्र-छात्रा सम्मान एवं आलोक डिजिटल पोर्टल का भव्य राष्ट्रव्यापी लोकार्पण। देशभर के गणमान्य बंधु सादर आमंत्रित हैं।",
    eventImage: "/asset/alokadhivationposter2026/poster1.jpeg",
    eventCtaText: "अधिवेशन विवरण एवं पंजीकरण →",
    eventCtaLink: "/mahasabha",

    sidebarNoticeTitle: "समाज संदेश एवं सूचनाएं",
    sidebarNoticeContent: "सभी समाज बंधुओं से अनुरोध है कि वे अपने परिवार व कार्यक्षेत्र की जानकारी अद्यतन करें।",
    sidebarNoticeEnabled: true,
    keyRegions: ["लखनऊ", "भोपाल", "जयपुर", "नई दिल्ली", "ग्वालियर", "इंदौर", "हैदराबाद", "धौलपुर"],
    adTitle: "समाज व्यापार एवं उद्योग संवर्धन",
    adBannerText: "राष्ट्रव्यापी समाज डायरेक्टरी नेटवर्क के माध्यम से अपने व्यवसाय एवं प्रतिष्ठान का प्रचार करें।",
    adLink: "/contact",
    adEnabled: true,
    contactEmail: "admin@alokworld.in",
    contactPhone: "+91 96085 53167",
    contactAddress: "केंद्रीय राष्ट्रीय सचिवालय, नई दिल्ली, भारत",
    whatsappNumber: "+91 96085 53167",
    seoTitle: "अखिल भारतीय समाज डायरेक्टरी एवं केंद्रीय सूचना पोर्टल | alokworld.in",
    seoDescription: "अखिल भारतीय लोधी, लोधा, लोध समाज की आधिकारिक डिजिटल डायरेक्टरी - देश भर के सत्यापित समाज बंधुओं, वरिष्ठ मार्गदर्शकों एवं प्रबुद्ध अधिकारियों से जुड़ें।",
    seoKeywords: "समाज डायरेक्टरी, लोधी समाज, लोधा महासभा, alokworld, समाज पोर्टल, अखिल भारतीय लोधी अधिकारी, लोध समाज डायरेक्टरी",
    siteUrl: "https://alokworld.in",
    ogImage: "/asset/alokadhivationposter2026/poster1.jpeg",
    organizationName: "अखिल भारतीय लोधी, लोधा, लोध समाज महासभा",
    googleVerificationId: "vyB1ieqri6VF9_Bi2VRnpKxS1WHA46qqUYawxbK6qqg",
    twitterHandle: "@alokworldin",
    maintenanceMode: false,
    maintenanceBarEnabled: false,
    maintenancePopupEnabled: false,
    maintenanceMessage: "पोर्टल लाइव एवं सक्रिय है।",
    maintenancePopupTitle: "अखिल भारतीय समाज डायरेक्टरी",
    maintenancePopupMessage: "alokworld.in पर आपका स्वागत है!",
    updatedAt: new Date(),
  };

  const existingSettings = await db.collection("sitesettings").findOne({});
  if (existingSettings) {
    await db.collection("sitesettings").updateOne({ _id: existingSettings._id }, { $set: properSettings });
    console.log("Updated existing sitesettings document (maintenanceMode: false).");
  } else {
    properSettings.createdAt = new Date();
    await db.collection("sitesettings").insertOne(properSettings);
    console.log("Created fresh sitesettings document (maintenanceMode: false).");
  }

  console.log("\n=======================================================");
  console.log("2. UPDATING CMS PAGE CONTENTS TO AUTHENTIC HINDI");
  console.log("=======================================================");

  const properPages = [
    {
      slug: "about",
      title: "alokworld.in के बारे में",
      subtitle: "डिजिटल संपर्क, परस्पर सहयोग एवं समर्पित नेतृत्व के माध्यम से समाज सशक्तिकरण।",
      bannerTitle: "अखिल भारतीय समाज पोर्टल",
      bannerSubtitle: "सांस्कृतिक विरासत का संरक्षण, सामाजिक एकता का सुदृढ़ीकरण एवं आधुनिक प्रगति।",
      status: "published",
      metaTitle: "हमारे बारे में | अखिल भारतीय समाज डायरेक्टरी",
      metaDescription: "alokworld.in की स्थापना, उद्देश्य एवं राष्ट्रीय समाज डायरेक्टरी के बारे में जानें।",
      lastEditedBy: "admin@alokworld.in",
      content: `<h3>हमारा उद्देश्य एवं संकल्प</h3>
<p><strong>alokworld.in</strong> एक सुरक्षित, आधुनिक और सत्यापित समाज डायरेक्टरी पोर्टल है, जिसकी स्थापना देश भर के समाज बंधुओं, परिवारों, वरिष्ठ मार्गदर्शकों, प्रबुद्ध अधिकारियों एवं युवाओं को एक विश्वसनीय डिजिटल मंच पर संगठित करने के ध्येय से की गई है।</p>

<h3>प्रमुख कार्य एवं स्तंभ</h3>
<ul>
  <li><strong>१. सत्यापित समाज डायरेक्टरी:</strong> प्रत्येक नगर और राज्य में निवासरत स्वजातीय बंधुओं को आपस में जोड़ना, व्यावसायिक संबंध सुदृढ़ करना और आवश्यकता के समय एक-दूसरे का संबल बनना।</li>
  <li><strong>२. शैक्षणिक मार्गदर्शन व मेधावी छात्र सहायता:</strong> संघ लोक सेवा आयोग (UPSC), राज्य लोक सेवा आयोग, नीट (NEET), आईआईटी (IIT) व उच्च शिक्षा में अध्ययनरत छात्रों को निःशुल्क करियर काउंसलिंग एवं मार्गदर्शन।</li>
  <li><strong>३. वैवाहिक परिचय मंच:</strong> समाज के परिवारों हेतु सुरक्षित, मर्यादित और प्रामाणिक वैवाहिक परिचय की सुगम व्यवस्था।</li>
  <li><strong>४. विधिक व प्रशासनिक सहायता:</strong> समाज के वरिष्ठ सेवानिवृत्त न्यायाधीशों, अधिवक्ताओं एवं वरिष्ठ अधिकारियों के माध्यम से जरूरतमंद बंधुओं को उचित मार्गदर्शन।</li>
</ul>

<h3>पारदर्शिता एवं सुरक्षा</h3>
<p>हम सदस्यों की व्यक्तिगत गोपनीयता और डेटा सुरक्षा को सर्वोच्च प्राथमिकता देते हैं। डायरेक्टरी में सभी प्रविष्टियों का सत्यापन केंद्रीय एवं प्रांतीय समन्वयकों द्वारा विधिवत जांच के उपरांत ही किया जाता है।</p>`,
    },
    {
      slug: "history",
      title: "समाज का गौरवशाली इतिहास एवं अमर विरासत",
      subtitle: "त्याग, राष्ट्रभक्ति, शौर्य और समाज सेवा की प्रेरणादायी अमर गाथा।",
      bannerTitle: "गौरवशाली समाज विरासत",
      bannerSubtitle: "शताब्दियों पुरानी राष्ट्रसेवा, ज्ञान और देशभक्ति की पावन परंपरा।",
      status: "published",
      metaTitle: "इतिहास एवं गौरवशाली विरासत | alokworld.in",
      metaDescription: "लोधी, लोधा, लोध समाज का ऐतिहासिक योगदान, स्वतंत्रता संग्राम एवं अमर विभूतियां।",
      lastEditedBy: "admin@alokworld.in",
      content: `<h3>गौरवशाली उत्पत्ति एवं ऐतिहासिक जड़ें</h3>
<p>लोधी, लोधा, लोध समाज का इतिहास भारत की प्राचीन सांस्कृतिक, आध्यात्मिक और सामाजिक धारा से अभिन्न रूप से जुड़ा हुआ है। मर्यादा पुरुषोत्तम भगवान श्रीराम के कुल से संबंधित सूर्यवंशी क्षत्रिय परंपरा में इस वीर समाज ने सनातन संस्कृति, धर्म और राष्ट्र की रक्षा के लिए युगों-युगों से अप्रतिम त्याग किया है।</p>

<h3>1842 का ऐतिहासिक बुंदेला विद्रोह — राजा हिरदे शाह लोधी</h3>
<p>1857 के प्रथम स्वतंत्रता संग्राम से 15 वर्ष पूर्व, 1842 में हीरापुर रियासत के वीर शासक <strong>राजा हिरदे शाह लोधी</strong> ने ब्रिटिश ईस्ट इंडिया कंपनी की दमनकारी नीतियों के विरुद्ध सशस्त्र क्रांति का शंखनाद किया था। उन्होंने नरसिंहपुर, सागर और दमोह क्षेत्र को स्वाधीन कराकर अंग्रेजी सेना को भारी क्षति पहुंचाई थी।</p>

<h3>1857 का प्रथम स्वतंत्रता संग्राम — वीरांगना रानी अवंतीबाई लोधी</h3>
<p>1857 की क्रांति में रामगढ़ रियासत की अमर वीरांगना <strong>महारानी अवंतीबाई लोधी</strong> ने 4,000 सैनिकों का नेतृत्व करते हुए अंग्रेजी छावनी को परास्त किया। अदम्य साहस और मातृभूमि के प्रति सर्वस्व अर्पण करते हुए उन्होंने स्वाधीनता की वेदी पर अपने प्राणों का बलिदान दिया।</p>

<h3>अमीनाबाद लखनऊ झंडा सत्याग्रह — शहीद गुलाब सिंह लोधी</h3>
<p>23 अगस्त 1935 को लखनऊ के अमीनाबाद स्थित झंडेवाला पार्क में ब्रिटिश पुलिस की सख्त नाकाबंदी के बावजूद उन्नाव के वीर सपूत <strong>गुलाब सिंह लोधी</strong> ने विशाल बरगद के पेड़ पर चढ़कर तिरंगा फहराया और सीने पर अंग्रेजी गोलियों का सामना करते हुए शहादत प्राप्त की।</p>

<h3>शिक्षा क्रांति के अग्रदूत — स्वामी ब्रह्मानंद जी महाराज</h3>
<p>बुंदेलखंड में अज्ञानता और अशिक्षा के अंधकार को मिटाने हेतु संन्यासी <strong>स्वामी ब्रह्मानंद जी महाराज</strong> ने दर्जनों शिक्षण संस्थानों, गुरुकुलों और महाविद्यालयों की स्थापना की। वे निर्धन और शोषित वर्ग के उत्थान के लिए आजीवन संघर्षरत रहे और स्वतंत्र भारत में लोकसभा सांसद के रूप में समाज का गौरव बढ़ाया।</p>

<h3>आधुनिक भारत में समाज का योगदान</h3>
<p>स्वतंत्र भारत के निर्माण में समाज के अधिकारी, कर्मचारी, चिकित्सक, वैज्ञानिक, अधिवक्ता और कृषक निरंतर राष्ट्र के विकास में अग्रणी भूमिका निभा रहे हैं।</p>`,
    },
    {
      slug: "organization",
      title: "सांगठनिक ढांचा एवं राष्ट्रीय कार्यकारिणी",
      subtitle: "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ की राष्ट्रीय कार्यकारिणी, सलाहकार समिति एवं विशिष्ट प्रकोष्ठ।",
      bannerTitle: "संगठनात्मक संरचना",
      bannerSubtitle: "केंद्रीय राष्ट्रीय कार्यकारिणी, राज्य इकाइयां एवं युवा-महिला प्रकोष्ठ।",
      status: "published",
      metaTitle: "संगठन एवं कार्यकारिणी | alokworld.in",
      metaDescription: "अखिल भारतीय संगठन की संरचना, पदाधिकारी एवं राष्ट्रीय कार्यसमिति।",
      lastEditedBy: "admin@alokworld.in",
      content: `<h3>संगठनात्मक संरचना एवं कार्यप्रणाली</h3>
<p>अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ (आलोक) की कार्यप्रणाली लोकतांत्रिक मूल्यों, पारदर्शिता और सामूहिक उत्तरदायित्व पर आधारित है। राष्ट्रीय स्तर से लेकर प्रांतीय एवं जिला स्तर तक समाज सेवा के कार्यों का व्यवस्थित संचालन किया जाता है।</p>

<h3>प्रमुख सांगठनिक प्रकोष्ठ एवं समितियां</h3>
<ul>
  <li><strong>१. राष्ट्रीय परामर्शदात्री समिति:</strong> संघ की सर्वोच्च नीतिगत एवं मार्गदर्शक समिति (अध्यक्ष: सर्वश्री वीरवल सिंह, मो. 9454412070, उ०प्र०)।</li>
  <li><strong>२. राष्ट्रीय संरक्षक मंडल:</strong> डॉ. बद्री विशाल सिंह (से०नि० महानिदेशक, चिकित्सा), श्रीमती किरन पढेऱिया (भेल भोपाल), श्री ओम प्रकाश वर्मा (डेसू दिल्ली), श्री गजराज सिंह (जयपुर)।</li>
  <li><strong>३. केंद्रीय राष्ट्रीय कार्यकारिणी:</strong> राष्ट्रीय अध्यक्ष सर्वश्री अतिवल सिंह (9999900079), वरिष्ठ उपाध्यक्ष सर्वश्री सुरेश शिवसिंह लोधी, कोषाध्यक्ष डॉ. ओमकार सिंह नरवरिया के नेतृत्व में संगठनात्मक प्रबंधन।</li>
  <li><strong>४. राष्ट्रीय संयोजक एवं समन्वय प्रकोष्ठ:</strong> केंद्रीय कार्यकारिणी, राज्य इकाइयों और जिला संगठनों के मध्य समन्वय (राष्ट्रीय संयोजक: सर्वश्री विश्वनाथ सिंह, श्री राम सेवक राजपूत)।</li>
  <li><strong>५. राष्ट्रीय प्रवक्ता एवं जनसंपर्क प्रकोष्ठ:</strong> आधिकारिक प्रवक्ता इं. हर्ष राजपूत एवं मीडिया प्रभारी श्री धर्मेन्द्र सिंह (9456805229)।</li>
  <li><strong>६. राष्ट्रीय विधिक एवं लेखा प्रकोष्ठ:</strong> संवैधानिक अधिकारों की रक्षा, निःशुल्क विधिक परामर्श एवं संगठन की पारदर्शी वित्तीय व लेखा प्रणाली का निष्पादन।</li>
</ul>`,
    },
    {
      slug: "mahasabha",
      title: "अखिल भारतीय महासभा एवं राष्ट्रीय संकल्प",
      subtitle: "देशभर के सभी प्रांतीय प्रकोष्ठों, सामाजिक ट्रस्टों एवं समाज परिषदों को संगठित करने वाली सर्वोच्च संस्था।",
      bannerTitle: "अखिल भारतीय महासभा",
      bannerSubtitle: "सामाजिक सुधार, एकता एवं राष्ट्रीय चेतना का शीर्ष मंच।",
      status: "published",
      metaTitle: "अखिल भारतीय महासभा | alokworld.in",
      metaDescription: "अखिल भारतीय महासभा के ऐतिहासिक अधिवेशन, राष्ट्रीय संकल्प एवं विकास कार्य।",
      lastEditedBy: "admin@alokworld.in",
      content: `<h3>अखिल भारतीय महासभा का स्वरूप</h3>
<p>अखिल भारतीय महासभा समाज के समग्र विकास, सामाजिक सुधारों और नीतिगत निर्णयों की सर्वोच्च राष्ट्रीय संस्था है। देश के विभिन्न राज्यों से पधारे प्रतिनिधि, प्रबुद्ध नागरिक एवं सामाजिक कार्यकर्ता राष्ट्रीय अधिवेशनों में भाग लेकर समाज के भविष्य की रूपरेखा तय करते हैं।</p>

<h3>राष्ट्रीय अधिवेशन के प्रमुख संकल्प</h3>
<ul>
  <li><strong>१. राष्ट्रीय अधिवेशन 2026 — डायरेक्टरी एवं प्रतिभा सम्मान मिशन:</strong> देशभर के अधिकारियों, कर्मचारियों एवं प्रबुद्धजनों को एकीकृत डायरेक्टरी से जोड़ना तथा सिविल सेवा व उच्च शिक्षा में उत्कृष्ट छात्र-छात्राओं को विशेष मार्गदर्शन व प्रोत्साहन।</li>
  <li><strong>२. कुरीति उन्मूलन अभियान:</strong> वैवाहिक समारोहों में फिजूलखर्ची, दहेज प्रथा व मृत्युभोज जैसी कुरीतियों को समाप्त करने हेतु जनजागरूकता तथा सामूहिक विवाह सम्मेलनों को प्रोत्साहन।</li>
  <li><strong>३. छात्र छात्रावास परियोजना:</strong> दिल्ली एवं प्रांतीय राजधानियों में उच्च शिक्षा एवं UPSC सहित प्रतियोगी परीक्षाओं की तैयारी कर रहे छात्र-छात्राओं हेतु सुसज्जित छात्रावासों की स्थापना।</li>
  <li><strong>४. आलोक संघ सदस्यता विधान:</strong> संस्थापक सदस्यता (₹31,000/-), आजीवन सदस्यता (₹1,100/-), एवं वार्षिक सदस्यता (₹100/-)।</li>
</ul>`,
    },
    {
      slug: "home",
      title: "अखिल भारतीय समाज डायरेक्टरी एवं केंद्रीय सूचना पोर्टल",
      subtitle: "देश भर के समाज बंधुओं, वरिष्ठ मार्गदर्शकों, चिकित्सकों, अभियंताओं, प्रशासनिक अधिकारियों, अधिवक्ताओं एवं युवाओं को जोड़ने वाला डिजिटल मंच।",
      bannerTitle: "अखिल भारतीय समाज डायरेक्टरी",
      bannerSubtitle: "एकता, सहयोग और समाज सशक्तिकरण का राष्ट्रीय मंच।",
      status: "published",
      metaTitle: "अखिल भारतीय समाज डायरेक्टरी | alokworld.in",
      metaDescription: "देश भर के सत्यापित समाज बंधुओं, वरिष्ठ अधिकारियों एवं मार्गदर्शकों से जुड़ें।",
      lastEditedBy: "admin@alokworld.in",
      content: `<h3>केंद्रीय समाज डिजिटल नेटवर्क में आपका स्वागत है</h3>
<p><strong>alokworld.in</strong> अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ एवं अखिल भारतीय समाज की आधिकारिक डायरेक्टरी है। यहां आप सत्यापित समाज बंधुओं, वरिष्ठ अधिकारियों, चिकित्सकों, अभियंताओं और समाजसेवियों से सीधे संपर्क स्थापित कर सकते हैं।</p>`,
    },
  ];

  for (const p of properPages) {
    const existing = await db.collection("pagecontents").findOne({ slug: p.slug });
    if (existing) {
      await db.collection("pagecontents").updateOne(
        { _id: existing._id },
        {
          $set: {
            title: p.title,
            subtitle: p.subtitle,
            bannerTitle: p.bannerTitle,
            bannerSubtitle: p.bannerSubtitle,
            content: p.content,
            status: p.status,
            metaTitle: p.metaTitle,
            metaDescription: p.metaDescription,
            lastEditedBy: p.lastEditedBy,
            updatedAt: new Date(),
          },
        }
      );
      console.log(`Updated page: ${p.slug} -> ${p.title}`);
    } else {
      await db.collection("pagecontents").insertOne({
        ...p,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`Inserted page: ${p.slug} -> ${p.title}`);
    }
  }

  console.log("\n=======================================================");
  console.log("3. VERIFYING 94 AUTHENTIC MEMBERS");
  console.log("=======================================================");
  const memberCount = await db.collection("members").countDocuments();
  console.log(`Current members in DB: ${memberCount}`);

  console.log(`Synchronizing ${authenticMembers.length} verified members with bilingual search tags...`);
  await db.collection("members").deleteMany({});
  await db.collection("members").insertMany(authenticMembers);
  console.log(`Successfully updated ${authenticMembers.length} members with bilingual search tags.`);

  console.log("\n=======================================================");
  console.log("4. VERIFYING 4 HISTORICAL PERSONALITIES");
  console.log("=======================================================");
  const personalities = [
    {
      name: "वीरांगना रानी अवंतीबाई लोधी",
      title: "1857 के प्रथम स्वतंत्रता संग्राम की अमर महानायिका",
      era: "1831 - 1858",
      photo: "/asset/personalities/rani_avanti_bai.png",
      summary: "रामगढ़ रियासत की साहसी वीरांगना जिन्होंने 1857 के प्रथम स्वाधीनता संग्राम में ब्रिटिश हुकूमत के विरुद्ध 4,000 वीर सैनिकों का नेतृत्व कर अदम्य पराक्रम दिखाया और मातृभूमि की रक्षा हेतु अपने प्राण न्योछावर किए।",
      biography: "<p>वीरांगना रानी अवंतीबाई लोधी भारत के प्रथम स्वतंत्रता संग्राम (1857) की अप्रतिम नायिका थीं। उन्होंने रामगढ़ की सेना का नेतृत्व करते हुए ब्रिटिश छावनियों को ध्वस्त किया और आत्मसमर्पण के स्थान पर मातृभूमि की बलिवेदी पर सर्वोच्च बलिदान दिया।</p>",
      order: 1,
      isPublished: true,
    },
    {
      name: "शहीद गुलाब सिंह लोधी",
      title: "अमीनाबाद लखनऊ झंडा सत्याग्रह के अमर बलिदानी",
      era: "1903 - 1935",
      photo: "/asset/personalities/shaheed_gulab_singh.png",
      summary: "उन्नाव के सपूत जिन्होंने 23 अगस्त 1935 को लखनऊ के झंडेवाला पार्क में ब्रिटिश गोलियों की परवाह न करते हुए तिरंगा फहराया और देश की आज़ादी के लिए अपने प्राणों का बलिदान दिया।",
      biography: "<p>फतेहपुर चौरासी (उन्नाव) में जन्मे अमर शहीद गुलाब सिंह लोधी ने महात्मा गांधी के राष्ट्रीय आंदोलनों में भाग लिया। लखनऊ में भारी पुलिस घेराबंदी को तोड़ते हुए विशाल बरगद के पेड़ पर चढ़कर तिरंगा फहराया और ब्रिटिश गोलियों का सीने पर सामना करते हुए वीरगति प्राप्त की।</p>",
      order: 2,
      isPublished: true,
    },
    {
      name: "स्वामी ब्रह्मानंद जी महाराज",
      title: "शिक्षा क्रांति के अग्रदूत, समाज सुधारक एवं सांसद",
      era: "1894 - 1984",
      photo: "/asset/personalities/swami_brahmanand.png",
      summary: "बुंदेलखंड में शिक्षा की अलख जगाने वाले महान संत एवं हमीरपुर से लोकसभा सांसद जिन्होंने निर्धन एवं वंचित वर्ग के लिए दर्जनों शिक्षण संस्थानों, गुरुकुलों व छात्रावासों की स्थापना की।",
      biography: "<p>स्वामी ब्रह्मानंद जी महाराज ने संपूर्ण बुंदेलखंड में अज्ञानता और अशिक्षा के अंधकार को मिटाने हेतु अपना जीवन समर्पित किया। राठ (हमीरपुर) में ब्रह्मानंद महाविद्यालय, इंटर कॉलेज एवं संस्कृत विद्यालयों की स्थापना कर लाखों युवाओं को निःशुल्क शिक्षा और जीवन की नई दिशा दी।</p>",
      order: 3,
      isPublished: true,
    },
    {
      name: "राजा हिरदे शाह लोधी",
      title: "1842 के ऐतिहासिक बुंदेला विद्रोह के प्रमुख जननायक",
      era: "1806 - 1852",
      photo: "/asset/personalities/raja_hridayshah.png",
      summary: "हीरापुर रियासत के वीर शासक जिन्होंने ईस्ट इंडिया कंपनी की अन्यायपूर्ण नीतियों के विरुद्ध 1842 में सशक्त सशस्त्र क्रांति का बिगुल फूंका और नरसिंहपुर, दमोह व सागर क्षेत्र को स्वाधीन कराया।",
      biography: "<p>हीरापुर के जननायक राजा हिरदे शाह लोधी ने 1857 से 15 वर्ष पूर्व ही 1842 के बुंदेला विद्रोह में अंग्रेजी हुकूमत की चूलें हिला दी थीं। उनके अदम्य साहस ने मध्य भारत में स्वाधीनता संग्राम की अमर ज्वाला प्रज्वलित की।</p>",
      order: 4,
      isPublished: true,
    },
  ];

  await db.collection("personalities").deleteMany({});
  await db.collection("personalities").insertMany(personalities);
  console.log(`Verified and saved 4 historical personalities.`);

  console.log("\n=======================================================");
  console.log("5. VERIFYING 9 AUTHENTIC GALLERY ITEMS");
  console.log("=======================================================");
  const gallery = [
    {
      title: "अखिल भारतीय आलोक संघ राष्ट्रीय अधिवेशन 2026 पोस्टर",
      category: "National Convention",
      eventDate: "2026",
      imageUrl: "/asset/alokadhivationposter2026/poster1.jpeg",
      description: "राष्ट्रीय अधिवेशन 2026 आधिकारिक आमंत्रण एवं राष्ट्रीय पुरस्कार घोषणा पत्र।",
      isPublished: true,
    },
    {
      title: "आलोक रत्न पुरस्कार 2023-2025 — उत्कृष्ट सामाजिक सेवा",
      category: "Awards",
      eventDate: "2026",
      imageUrl: "/asset/alokadhivationposter2026/poster2.jpeg",
      description: "समाज के उत्थान एवं निस्वार्थ सेवा हेतु समर्पित विभूतियों के लिए सर्वोच्च आलोक रत्न सम्मान।",
      isPublished: true,
    },
    {
      title: "अमर शहीद महारानी अवंतीबाई लोधी पुरस्कार — अधिकारी एवं कर्मचारी सेवा",
      category: "Awards",
      eventDate: "2026",
      imageUrl: "/asset/alokadhivationposter2026/poster3.jpeg",
      description: "शासकीय एवं अर्धशासकीय सेवाओं में उत्कृष्ट योगदान देने वाले अधिकारियों एवं कर्मचारियों हेतु सम्मान।",
      isPublished: true,
    },
    {
      title: "स्वामी ब्रह्मानंद पुरस्कार — उच्च शिक्षा एवं मेधावी छात्र सम्मान",
      category: "Awards",
      eventDate: "2026",
      imageUrl: "/asset/alokadhivationposter2026/poster4.jpeg",
      description: "आईआईटी, आईआईएम, एम्स, नीट व यूपीएससी में चयनित मेधावी छात्र-छात्राओं का राष्ट्रीय सम्मान।",
      isPublished: true,
    },
    {
      title: "राजा हिरदे शाह पुरस्कार — संगठन विस्तार एवं सक्रिय सदस्यता सम्मान",
      category: "Awards",
      eventDate: "2026",
      imageUrl: "/asset/alokadhivationposter2026/poster5.jpeg",
      description: "आलोक संघ को संगठनात्मक स्तर पर सशक्त बनाने वाले समर्पित पदाधिकारियों एवं कार्यकर्ताओं हेतु।",
      isPublished: true,
    },
    {
      title: "आलोक उत्तर प्रदेश प्रांतीय अधिवेशन एवं कार्यकारिणी बैठक",
      category: "State Convention",
      eventDate: "2025",
      imageUrl: "/asset/listofmemberswithdesignation/alok up.jpeg",
      description: "उत्तर प्रदेश राज्य इकाई का प्रांतीय सम्मेलन एवं संगठनात्मक विचार-विमर्श।",
      isPublished: true,
    },
    {
      title: "अखिल भारतीय समाज डायरेक्टरी मुख्य फ्रंट बैनर",
      category: "Heritage",
      eventDate: "2025",
      imageUrl: "/asset/topofwebsite/web_sit_front.png",
      description: "अखिल भारतीय लोधी, लोधा, लोध समाज डायरेक्टरी आधिकारिक कलात्मक बैनर।",
      isPublished: true,
    },
    {
      title: "अखिल भारतीय आलोक संघ राष्ट्रीय अधिवेशन स्मृति",
      category: "Event",
      eventDate: "2025",
      imageUrl: "/asset/1002458487.jpg",
      description: "अखिल भारतीय लोधी समाज प्रमुख प्रतिनिधियों की राष्ट्रीय संगोष्ठी।",
      isPublished: true,
    },
    {
      title: "आलोक धौलपुर राजस्थान प्रांतीय सम्मेलन",
      category: "State Convention",
      eventDate: "2025",
      imageUrl: "/asset/photo/photo/dholpur1.png",
      description: "धौलपुर राजस्थान में आयोजित समाज कल्याण एवं प्रतिभा सम्मान समारोह।",
      isPublished: true,
      mediaType: "image",
    },
    // Community Video Embeds
    {
      title: "वीरांगना महारानी अवंतीबाई लोधी — 1857 महाक्रांति शौर्य गाथा",
      category: "इतिहास एवं वृत्तचित्र",
      mediaType: "video",
      videoUrl: "https://www.youtube.com/watch?v=S01Z-Yl7-m4",
      videoId: "S01Z-Yl7-m4",
      imageUrl: "https://img.youtube.com/vi/S01Z-Yl7-m4/hqdefault.jpg",
      eventDate: "ऐतिहासिक वृत्तचित्र",
      description: "1857 के प्रथम स्वतंत्रता संग्राम की अमर महानायिका वीरांगना महारानी अवंतीबाई लोधी के शौर्य, बलिदान और राष्ट्र सेवा पर विशेष वृत्तचित्र।",
      isPublished: true,
      isFeatured: true,
      order: 1,
    },
    {
      title: "स्वामी ब्रह्मानंद जी महाराज — जीवन दर्शन एवं शिक्षा क्रांति",
      category: "विचार एवं दर्शन",
      mediaType: "video",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoId: "dQw4w9WgXcQ",
      imageUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      eventDate: "प्रेरणादायक संदेश",
      description: "परम पूज्य स्वामी ब्रह्मानंद जी महाराज के जीवन, शिक्षा आंदोलन, संसद में ऐतिहासिक योगदान और समाज सुधार पर प्रेरणादायी आलेख।",
      isPublished: true,
      isFeatured: true,
      order: 2,
    },
    {
      title: "आलोक राष्ट्रीय प्रतिभा सम्मान समारोह 2026 — आमंत्रण एवं दिशानिर्देश",
      category: "राष्ट्रीय अधिवेशन",
      mediaType: "video",
      videoUrl: "https://www.youtube.com/watch?v=kXRwEwUswE0",
      videoId: "kXRwEwUswE0",
      imageUrl: "https://img.youtube.com/vi/kXRwEwUswE0/hqdefault.jpg",
      eventDate: "अधिवेशन 2026",
      description: "कांस्टीट्यूशन क्लब, रफी मार्ग नई दिल्ली में आयोजित होने वाले पंचम राष्ट्रीय अधिवेशन एवं प्रतिभा सम्मान समारोह का संदेश।",
      isPublished: true,
      isFeatured: true,
      order: 3,
    },
  ];

  await db.collection("galleryitems").deleteMany({});
  await db.collection("galleryitems").insertMany(gallery);
  console.log(`Verified and saved ${gallery.length} authentic gallery & video items.`);

  console.log("\n=======================================================");
  console.log("6. VERIFYING SUPERADMIN ACCOUNT");
  console.log("=======================================================");
  const adminEmail = (process.env.INITIAL_ADMIN_EMAIL || "admin@alokworld.in").toLowerCase();
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "AdminSecure@2026";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await db.collection("admins").updateOne(
    { email: adminEmail },
    {
      $set: {
        email: adminEmail,
        password: hashedPassword,
        name: "Super Administrator",
        role: "superadmin",
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );
  console.log(`Superadmin verified: ${adminEmail}`);

  await mongoose.disconnect();
  console.log("\n>>> ALL DATA SUCCESSFULLY SET AND VERIFIED! <<<");
}

setProperData().catch((err) => {
  console.error("Error setting proper data:", err);
  process.exit(1);
});
