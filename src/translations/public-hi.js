/**
 * Public Website Hindi Translation Dictionary & Constants
 *
 * Strict requirement: All public-facing website pages, headers, navigation,
 * footers, member profiles, public forms, and notices in alokworld.in
 * MUST remain in authentic, natural Hindi with proper Devanagari Unicode.
 */

export const PUBLIC_I18N = {
  // Navigation Links
  navLinks: [
    { label: "मुख्य पृष्ठ", href: "/" },
    { label: "इतिहास", href: "/history" },
    { label: "संगठन", href: "/organization" },
    { label: "महासभा", href: "/mahasabha" },
    { label: "सदस्य निर्देशिका", href: "/directory" },
    { label: "महान विभूतियाँ", href: "/personalities" },
    { label: "चित्र दीर्घा", href: "/gallery" },
    { label: "हमारे बारे में", href: "/about" },
    { label: "संपर्क करें", href: "/contact" },
  ],

  // Header & Brand
  header: {
    orgTitle: "अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ",
    orgSubtitle: "अखिल भारतीय लोधी समाज निर्देशिका — alokworld.in",
    menuToggle: "नेविगेशन मेनू",
    bannerAlt: "अखिल भारतीय लोधी अधिकारी-कर्मचारी संघ — alokworld.in",
  },

  // Footer
  footer: {
    brandTitle: "अखिल भारतीय समाज",
    brandDesc: "अखिल भारतीय लोधी-लोधा अधिकारी-कर्मचारी संघ (आलोक) एवं समाज डायरेक्टरी — देशभर के सभी सत्यापित सदस्यों, वरिष्ठजनों एवं प्रबुद्धजनों का आधिकारिक मंच।",
    domainLabel: "पोर्टल डोमेन:",
    colNavTitle: "सामुदायिक नेविगेशन",
    colServicesTitle: "सेवाएं एवं नियम",
    colContactTitle: "केंद्रीय सचिवालय संपर्क",
    copyright: "सर्वाधिकार सुरक्षित। अखिल भारतीय लोधी समाज डायरेक्टरी alokworld.in",
    adminPortalLink: "प्रशासन नियंत्रण कक्ष",
  },

  // Directory & Search
  directory: {
    title: "अखिल भारतीय समाज सदस्य निर्देशिका",
    subtitle: "देशभर के सभी क्षेत्रों, विभागों एवं व्यवसायों में कार्यरत समाज के प्रबुद्ध बंधुओं की सत्यापित सूची।",
    searchPlaceholder: "नाम, पद, विभाग, शहर अथवा राज्य से खोजें...",
    allStates: "सभी राज्य",
    allDistricts: "सभी जिले",
    allDepartments: "सभी विभाग",
    viewModeTable: "तालिका दृश्य",
    viewModeCards: "कार्ड दृश्य",
    totalMembers: "कुल सदस्य",
    resultsFound: "सदस्य मिले",
    table: {
      photo: "चित्र",
      name: "पूरा नाम",
      designation: "पद एवं व्यवसाय",
      department: "विभाग / कार्यालय",
      location: "स्थान / शहर",
      phone: "संपर्क नंबर",
      actions: "विवरण",
      viewProfile: "विवरण देखें →",
    },
    noResults: "आपकी खोज के अनुसार कोई सदस्य प्राप्त नहीं हुआ। कृपया अन्य शब्द अथवा फ़िल्टर से प्रयास करें।",
  },

  // Member Profile
  memberProfile: {
    backToDirectory: "← सदस्य निर्देशिका पर वापस जाएं",
    personalInfo: "व्यक्तिगत जानकारी",
    professionalInfo: "पद एवं कार्यक्षेत्र",
    contactInfo: "संपर्क सूत्र",
    addressInfo: "पत्राचार एवं निवास का पता",
    fatherSpouse: "पिता / पति का नाम",
    designation: "पद / व्यवसाय",
    department: "विभाग / संस्था",
    officeAddress: "कार्यालय का पता",
    homeAddress: "निवास का पता",
    city: "शहर",
    district: "जिला",
    state: "राज्य",
    pincode: "पिन कोड",
    phone: "मोबाइल नंबर",
    whatsapp: "व्हाट्सएप",
    email: "ईमेल पता",
    bloodGroup: "रक्त समूह",
    membershipStatus: "सदस्यता स्थिति",
    biography: "परिचय एवं सामाजिक योगदान",
    verifiedMember: "सत्यापित समाज सदस्य",
  },

  // Public Contact Form
  contact: {
    title: "सचिवालय से संपर्क करें",
    subtitle: "निर्देशिका में नाम जुड़वाने, संशोधन अथवा समाज संबंधी किसी भी सुझाव के लिए केंद्रीय सचिवालय को संदेश भेजें।",
    fields: {
      fullName: "पूरा नाम *",
      fullNamePlaceholder: "अपना पूरा नाम दर्ज करें",
      email: "ईमेल पता *",
      emailPlaceholder: "example@domain.com",
      phone: "मोबाइल नंबर",
      phonePlaceholder: "10 अंकों का मोबाइल नंबर",
      subject: "विषय *",
      subjectPlaceholder: "संदेश का विषय दर्ज करें",
      message: "संदेश विवरण *",
      messagePlaceholder: "अपना संदेश अथवा विवरण विस्तार से लिखें...",
    },
    submitButton: "संदेश भेजें →",
    submittingButton: "संदेश प्रेषित किया जा रहा है...",
    successMessage: "धन्यवाद! आपका संदेश सफलतापूर्वक केंद्रीय सचिवालय को प्राप्त हो गया है। आपके ईमेल पर पावती भेज दी गई है।",
    errorMessage: "संदेश भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें अथवा सीधे फोन पर संपर्क करें।",
  },
};
