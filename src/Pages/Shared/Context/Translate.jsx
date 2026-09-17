import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
    en: {
      translation: {
        home: "Home",
        welcome: "Welcome to our application!",
        about: "About Us",
        contact: "Contact",
        chat: "Chat",
        account: "Account",
        allAds: "All Ads",
        postFreeAd: "POST FREE AD",
        communitySuccess: "#1 Find Everything, Anytime, Anywhere.",
        fromPeople: "From People Like You",
        startEarning: "Start Earning Money!",
        sellSomething: "Turn your items into cash! Upload your first product and start selling.!",
        freeAd: "Post Free Ad",
        boostAd: "Boost Ad Products",
        boostDescription: "Make your sale faster with multiple Boost Ad options! Boost your ads as you like and sell your products faster. .! ",
        learnMore: "Learn More →",
        logins: "Login",
  
        // Adding new translations for the data
        oneStopSolutionTitle: "What is SellFlit, and what does it offer?",
        oneStopSolutionDesc: "SellFlit is Bangladesh's largest marketplace, providing a platform to buy and sell almost everything, from vehicles and properties to mobile phones, electronics, and more. It caters to both new and used products across more than 50 categories.",
        trackRecordTitle: "How does SellFlit make buying and selling easy?",
        trackRecordDesc: "SellFlit offers a simple, fast, and hassle-free experience. Users can shop or sell new and pre-loved items with just a few clicks, anytime and anywhere..",
        globalServiceReachTitle: "Can I sell used products on SellFlit?",
        globalServiceReachDesc: "Absolutely! SellFlit is perfect for selling pre-loved items. Users can post ads for free and reach potential buyers based on their location.",
        excellenceTitle: "Is SellFlit safe for transactions?",
        excellenceDesc: "Yes, SellFlit prioritizes user safety by verifying members and dealers, ensuring a secure environment for buying and selling.",
        extensiveNetworkTitle: "Does SellFlit provide support for users and businesses?",
        extensiveNetworkDesc: "Yes, SellFlit offers excellent customer service and a membership program for businesses to expand their reach and connect with more customers.",
        strategicPartnershipTitle: "Why should I choose SellFlit over other platforms?",
        strategicPartnershipDesc: "SellFlit provides a reliable and convenient marketplace experience, offering free ad posting, a wide variety of categories, and a trusted platform for all your buying and selling needs..",


         // New translations for ToggleDescription component
      aboutBikroyTitle: "About SellFlit: The Largest Marketplace in Bangladesh!",
      aboutBikroyShortDesc: "SellFlit is your ultimate platform for buying and selling almost everything! Whether you're looking to buy or sell vehicles, find properties, get jobs or recruit employees, purchase mobile phones, shop for electronics, or more, SellFlit has you covered. With over 50 categories, our platform is designed to be safe, smart, and convenient for everyone. Each month, millions of users visit SellFlit to explore products and services, from mobile phones and musical instruments to cars, homes, jobs, and beyond, all through classified ads.",
      showMore: "Show more",
      aboutBikroyFullDesc: "SellFlit is your ultimate platform for buying and selling almost everything! Whether you're looking to buy or sell vehicles, find properties, get jobs or recruit employees, purchase mobile phones, shop for electronics, or more, SellFlit has you covered. With over 50 categories, our platform is designed to be safe, smart, and convenient for everyone. Each month, millions of users visit SellFlit to explore products and services, from mobile phones and musical instruments to cars, homes, jobs, and beyond, all through classified ads.",
      buySellRentJobsTitle: "Why Choose SellFlit?",
      buySellRentJobsDesc: "SellFlit offers a fast and easy experience for buying and selling in Bangladesh. Whether you're looking to buy or sell, our platform makes it simple and hassle-free. With just a few clicks, you can shop or sell new products, pre-loved items, or anything in between, anytime and anywhere. As a free classified platform, SellFlit allows users to post ads for free across multiple categories, connecting buyers and sellers effortlessly based on their location. Additionally, our platform prioritizes safety and security by verifying members and dealers, ensuring a trusted environment for shopping and trading. Choose SellFlit for a reliable and convenient marketplace experience for all your new and used product needs!",
      easyShoppingTitle: "Safe & Secure Shopping",
      businessMembershipTitle: "Membership Service for Businesses",
      benefitsTitle: "Categories on SellFlit",
      fastEasyExperience: "SellFlit provides a diverse range of categories to meet everyone's needs. From Mobiles & Electronics, including mobile phones, laptops, and cameras, to Vehicles, such as cars and motorcycles, SellFlit has it all. Explore Rent Services for homes and offices, or Properties to buy or sell land and real estate. Enhance your living space with Home Décor like furniture and kitchenware, or shop for Men’s Fashion and Women’s Fashion, offering clothing, accessories, and shoes. Find or adopt pets in the Pets category, and discover your passions with Hobbies & Sports, including musical instruments and fitness gear. Whether you need Education materials or Services like professional help, SellFlit has you covered. Begin your journey today with SellFlit and enjoy a smooth, reliable marketplace experience in Bangladesh!",
      postAdsFree: "Post Ads Free: As a free classified website, we offer free ad posting features in many categories for the convenience of the users based on their locations.",
      safeSecureShopping: "Safe & Secure Shopping: We have listed our verified members and authorized dealers to create a safe shopping experience for our users.",
      showLess: "Show less",


      // Footer translations
      moreFromBikroy: "More from SellFlit",
      sellFast: "Sell Fast",
      membership: "Membership",
      bannerAds: "Banner Ads",
      boostAds: "Boost Ad",
      helpAndSupport: "Help and Support",
      faq: "FAQs",
      staySafe: "Stay Safe",
      contactUs: "Contact Us",
      aboutBikroy: "About SellFlit",
      aboutUs: "About Us",
      careers: "Careers",
      termsAndConditions: "Terms and Conditions",
      privacyPolicy: "Privacy Policy",
      sitemap: "Sitemap",
      blogGuides: "Blog and Guides",
      carsGuide: "Upload Guide",
      bikesGuide: "Package Guide",
      propertyGuide: "Account Guide",
      officialBlog: "Official Blog",
      downloadOurApp: "Service SellFlit",
      googlePlay: "Post Free Ad",
      appStore: "Account Details",
      otherCountries: "Category Service",
      Bangladesh: "Bangladesh",
      allRightsReserved: "All rights reserved",


    //   settingd data 
    myAds: "My Ads",
      myMembership: "My Membership",
      savedSearches: "Saved searches",
      favourite: "Favourite",
      settings: "Settings",
      phoneNumber: "Phone number",

      welcomeMessage: "Welcome SellFlit! Let's post an ad.",
chooseOption: "Choose any option below",

sellSomethings: "Sell something",
sellItemCategoryService: "Sell an item, Category or service",

offerCategoryService: "Offer a Category for Service",

postJobVacancy: "Post a job vacancy",
postJobBangladesh: "Post a job in Bangladesh",
postJobSellFlit: "Post a job on SellFlit",

lookForSomething: "Look for something",
lookForPropertyRent: "Look for property to rent",
lookForSomethingBuy: "Look for something to buy",

postingAllowance: "Know your posting allowance  ",
postingAllowance2: "See our posting rules  ",





      youHaveNoAds: "You don’t have any ads yet.",
      clickPostAdNow: "Click the Post an ad now! button to post your ad.",
      postYourAdNow: "Post your ad now!",
      becomeMember: "Become a member",
      membershipDescription: "Memberships give your business a voice and presence, unlocking tools like sales analytics, a business page, and discounted ad promotions.",
      noSavedSearches: "You have no saved searches.",
      savedSearchHint: "To save a search, click on “Saved search” in your list of search results and we will update you when there is a new item added.",
      saveSearch: "Save search",
      noFavorites: "You haven’t marked any ads as favorite yet.",
      clickStarToFavorite: "Click on the star symbol on any ad to save it as a favorite.",
      browseAdsHint: "Start to browse ads to find ads you would like to favorite.",
      browseAds: "Browse ads",
      settingss: "Settings",
      settingsDescription: "Manage your account settings here.",
      phoneNumbersTitle: "Phone Numbers",
    noPhoneNumbers:
      "There are currently no phone numbers associated with your account.",
    phoneNumbersDescription:
      "Phone numbers are unique to your account and will be collected while you are posting ads or ordering products on Bikroy.",
      },

      
    },
    bn: {
      translation: {
        home: "হোম",
        welcome: "আমাদের অ্যাপ্লিকেশনে স্বাগতম!",
        about: "আমাদের সম্পর্কে",
        contact: "যোগাযোগ",
        chat: "চ্যাট",
        account: "অ্যাকাউন্ট",
        allAds: "সমস্ত বিজ্ঞাপন",
        postFreeAd: "ফ্রি বিজ্ঞাপন দিন",
        communitySuccess: "#১ সবকিছু খুঁজুন, যেকোনো সময়, যেকোনো জায়গায়।",
        fromPeople: "আপনার মতো মানুষের থেকে",
        startEarning: "অর্থ উপার্জন শুরু করুন!",
        sellSomething: "আপনার জিনিসপত্রকে নগদে পরিণত করুন! আপনার প্রথম পণ্য আপলোড করুন এবং বিক্রি শুরু করুন।!",
        freeAd: "ফ্রি বিজ্ঞাপন দিন",
        boostAd: "বিজ্ঞাপন বুস্ট করুন",
        boostDescription: "একাধিক বুস্ট বিজ্ঞাপন বিকল্পের মাধ্যমে আপনার বিক্রয় দ্রুত করুন! আপনার পছন্দ মতো বিজ্ঞাপনগুলি বুস্ট করুন এবং আপনার পণ্যগুলি দ্রুত বিক্রি করুন। ।!",
        learnMore: "আরও জানুন →",
        logins: "লগ ইন",
  
        // Adding new translations for the data
        
          oneStopSolutionTitle: "সেলফ্লিট কী এবং এটি কী অফার করে?",
          oneStopSolutionDesc: "সেলফ্লিট বাংলাদেশের সবচেয়ে বড় মার্কেটপ্লেস, যা যানবাহন ও সম্পত্তি থেকে শুরু করে মোবাইল ফোন, ইলেকট্রনিক্স এবং আরও অনেক কিছু কেনা-বেচার জন্য একটি প্ল্যাটফর্ম সরবরাহ করে। এটি নতুন এবং ব্যবহৃত পণ্যগুলির জন্য ৫০টিরও বেশি ক্যাটাগরিতে সেবা দেয়।",
          
          trackRecordTitle: "সেলফ্লিট কীভাবে কেনা-বেচা সহজ করে?",
          trackRecordDesc: "সেলফ্লিট একটি সহজ, দ্রুত এবং ঝামেলামুক্ত অভিজ্ঞতা প্রদান করে। ব্যবহারকারীরা নতুন বা ব্যবহৃত আইটেম কয়েকটি ক্লিকেই, যে কোনো সময় এবং যে কোনো জায়গা থেকে কেনা বা বিক্রি করতে পারে।",
          
          globalServiceReachTitle: "সেলফ্লিট-এ কি ব্যবহৃত পণ্য বিক্রি করা যাবে?",
          globalServiceReachDesc: "অবশ্যই! সেলফ্লিট ব্যবহৃত পণ্য বিক্রির জন্য আদর্শ। ব্যবহারকারীরা বিনামূল্যে বিজ্ঞাপন পোস্ট করতে পারে এবং তাদের লোকেশনের ভিত্তিতে সম্ভাব্য ক্রেতাদের কাছে পৌঁছাতে পারে।",
          
          excellenceTitle: "সেলফ্লিট কি লেনদেনের জন্য নিরাপদ?",
          excellenceDesc: "হ্যাঁ, সেলফ্লিট ব্যবহারকারীদের নিরাপত্তাকে অগ্রাধিকার দেয়, সদস্য এবং ডিলারদের যাচাই করে একটি নিরাপদ কেনা-বেচার পরিবেশ নিশ্চিত করে।",
          
          extensiveNetworkTitle: "সেলফ্লিট কি ব্যবহারকারী এবং ব্যবসার জন্য সাপোর্ট প্রদান করে?",
          extensiveNetworkDesc: "হ্যাঁ, সেলফ্লিট ব্যবহারকারীদের জন্য চমৎকার গ্রাহক সেবা এবং ব্যবসার জন্য একটি মেম্বারশিপ প্রোগ্রাম প্রদান করে, যা তাদের আরও গ্রাহকের সাথে সংযোগ স্থাপনে সহায়তা করে।",
          
          strategicPartnershipTitle: "অন্যান্য প্ল্যাটফর্মের তুলনায় সেলফ্লিট কেন বেছে নেবেন?",
          strategicPartnershipDesc: "সেলফ্লিট একটি নির্ভরযোগ্য এবং সুবিধাজনক মার্কেটপ্লেস অভিজ্ঞতা প্রদান করে। এটি বিনামূল্যে বিজ্ঞাপন পোস্টিং, বিভিন্ন ক্যাটাগরি এবং আপনার কেনা-বেচার প্রয়োজনের জন্য একটি বিশ্বাসযোগ্য প্ল্যাটফর্ম সরবরাহ করে।",
        
          welcomeMessage: "স্বাগতম SellFlit! একটি বিজ্ঞাপন পোস্ট করুন।",
          chooseOption: "নীচে যেকোনো একটি বিকল্প নির্বাচন করুন",
          
          sellSomethings: "কিছু বিক্রি করুন",
          sellItemCategoryService: "একটি আইটেম, বিভাগ বা পরিষেবা বিক্রি করুন",
          
          offerCategoryService: "পরিষেবার জন্য একটি বিভাগ অফার করুন",
          
          postJobVacancy: "একটি চাকরির বিজ্ঞাপন পোস্ট করুন",
          postJobBangladesh: "বাংলাদেশে একটি চাকরির বিজ্ঞাপন পোস্ট করুন",
          postJobSellFlit: "SellFlit-এ একটি চাকরির বিজ্ঞাপন পোস্ট করুন",
          
          lookForSomething: "কিছু খুঁজছেন",
          lookForPropertyRent: "ভাড়ার জন্য সম্পত্তি খুঁজুন",
          lookForSomethingBuy: "কিছু কেনার জন্য খুঁজুন",
          
          postingAllowance: "আপনার পোস্টিং ভাতা জানুন " ,
          postingAllowance2:"আমাদের পোস্টিং নিয়ম দেখুন",
          


        

        // Bengali translations for ToggleDescription component
        aboutBikroyTitle: "সেলফ্লিট সম্পর্কে: বাংলাদেশের সবচেয়ে বড় মার্কেটপ্লেস!",
        aboutBikroyShortDesc: "সেলফ্লিট হল আপনার কেনা-বেচার জন্য চূড়ান্ত প্ল্যাটফর্ম! আপনি গাড়ি কিনতে বা বিক্রি করতে চান, সম্পত্তি খুঁজতে চান, চাকরি খুঁজছেন বা কর্মচারী নিয়োগ করতে চান, মোবাইল ফোন কিনতে চান, ইলেকট্রনিক পণ্য কিনতে চান বা আরও কিছু চান, সেলফ্লিট আপনার জন্য আছে। ৫০টিরও বেশি ক্যাটাগরির মাধ্যমে আমাদের প্ল্যাটফর্মটি সবাইকে নিরাপদ, স্মার্ট এবং সুবিধাজনক পরিষেবা দিতে ডিজাইন করা হয়েছে। প্রতি মাসে, লক্ষ লক্ষ ব্যবহারকারী সেলফ্লিটে আসেন মোবাইল ফোন, বাদ্যযন্ত্র, গাড়ি, বাড়ি, চাকরি এবং আরও অনেক কিছু খুঁজতে এবং বিক্রি করতে ক্লাসিফাইড বিজ্ঞাপনের মাধ্যমে।",
  showMore: "আরও দেখুন",
  aboutBikroyFullDesc: "সেলফ্লিট হল আপনার কেনা-বেচার জন্য চূড়ান্ত প্ল্যাটফর্ম! আপনি গাড়ি কিনতে বা বিক্রি করতে চান, সম্পত্তি খুঁজতে চান, চাকরি খুঁজছেন বা কর্মচারী নিয়োগ করতে চান, মোবাইল ফোন কিনতে চান, ইলেকট্রনিক পণ্য কিনতে চান বা আরও কিছু চান, সেলফ্লিট আপনার জন্য আছে। ৫০টিরও বেশি ক্যাটাগরির মাধ্যমে আমাদের প্ল্যাটফর্মটি সবাইকে নিরাপদ, স্মার্ট এবং সুবিধাজনক পরিষেবা দিতে ডিজাইন করা হয়েছে। প্রতি মাসে, লক্ষ লক্ষ ব্যবহারকারী সেলফ্লিটে আসেন মোবাইল ফোন, বাদ্যযন্ত্র, গাড়ি, বাড়ি, চাকরি এবং আরও অনেক কিছু খুঁজতে এবং বিক্রি করতে ক্লাসিফাইড বিজ্ঞাপনের মাধ্যমে।",
  buySellRentJobsTitle: "কেন সেলফ্লিট বেছে নেবেন?",
  buySellRentJobsDesc: "সেলফ্লিট বাংলাদেশে কেনা-বেচার জন্য একটি দ্রুত এবং সহজ অভিজ্ঞতা প্রদান করে। আপনি কিনতে বা বিক্রি করতে চাইলে, আমাদের প্ল্যাটফর্মটি সহজ এবং ঝামেলামুক্ত। কয়েকটি ক্লিকেই আপনি নতুন পণ্য, পুরাতন পণ্য বা এর মধ্যে যেকোনো কিছু কেনা-বেচা করতে পারেন, যেকোনো সময়, যেকোনো জায়গা থেকে। একটি ফ্রি ক্লাসিফাইড প্ল্যাটফর্ম হিসাবে, সেলফ্লিট ব্যবহারকারীদের বিভিন্ন ক্যাটাগরিতে বিনামূল্যে বিজ্ঞাপন পোস্ট করার সুবিধা দেয়, যা অবস্থান ভিত্তিক ক্রেতা-বিক্রেতাদের সাথে সহজেই সংযোগ স্থাপন করে। এছাড়াও, আমাদের প্ল্যাটফর্মটি নিরাপদ এবং সুরক্ষিত কেনা-বেচার অভিজ্ঞতা নিশ্চিত করতে সদস্য এবং ডিলারদের যাচাই করে। আপনার নতুন এবং পুরাতন পণ্যের সমস্ত প্রয়োজনের জন্য সেলফ্লিট একটি নির্ভরযোগ্য এবং সুবিধাজনক মার্কেটপ্লেস!",
  easyShoppingTitle: "নিরাপদ এবং সুরক্ষিত কেনাকাটা",
  businessMembershipTitle: "ব্যবসার জন্য সদস্যপদ পরিষেবা",
  benefitsTitle: "সেলফ্লিটের ক্যাটাগরিগুলি",
  fastEasyExperience: "সেলফ্লিট বিভিন্ন ক্যাটাগরি প্রদান করে যা সবার প্রয়োজন মেটাতে সক্ষম। মোবাইল ও ইলেকট্রনিক্স যেমন মোবাইল ফোন, ল্যাপটপ এবং ক্যামেরা থেকে শুরু করে যানবাহন যেমন গাড়ি এবং মোটরসাইকেল পর্যন্ত সবই সেলফ্লিটে পাওয়া যায়। বাড়ি বা অফিস ভাড়া পরিষেবা, অথবা জমি এবং রিয়েল এস্টেট কেনা-বেচার জন্য প্রপার্টি ক্যাটাগরি অন্বেষণ করুন। আসবাবপত্র এবং রান্নাঘরের জিনিসপত্রের মতো হোম ডেকর দিয়ে আপনার বসবাসের স্থান সাজান অথবা পুরুষ এবং মহিলাদের ফ্যাশন ক্যাটাগরিতে পোশাক, আনুষঙ্গিক এবং জুতা কিনুন। পোষা প্রাণী ক্যাটাগরিতে পোষা প্রাণী কিনুন, বিক্রি করুন বা গ্রহণ করুন এবং বাদ্যযন্ত্র, ফিটনেস সরঞ্জাম এবং ক্রীড়া সামগ্রীর মতো হবি এবং স্পোর্টস দিয়ে আপনার শখ পূরণ করুন। আপনি শিক্ষা সামগ্রী বা পেশাদার পরিষেবা প্রয়োজন হলে, সেলফ্লিট আপনাকে সাহায্য করবে। আজই সেলফ্লিটে আপনার যাত্রা শুরু করুন এবং বাংলাদেশে একটি সহজ, নির্ভরযোগ্য মার্কেটপ্লেস অভিজ্ঞতা উপভোগ করুন!",
  postAdsFree: "বিজ্ঞাপন বিনামূল্যে পোস্ট করুন: একটি ফ্রি ক্লাসিফাইড ওয়েবসাইট হিসাবে, আমরা ব্যবহারকারীদের সুবিধার জন্য তাদের অবস্থানের উপর ভিত্তি করে অনেক ক্যাটাগরিতে বিনামূল্যে বিজ্ঞাপন পোস্ট করার সুযোগ দিই।",
  safeSecureShopping: "নিরাপদ এবং সুরক্ষিত কেনাকাটা: আমরা আমাদের ব্যবহারকারীদের জন্য একটি নিরাপদ কেনাকাটার অভিজ্ঞতা তৈরি করতে আমাদের যাচাইকৃত সদস্য এবং অনুমোদিত ডিলারদের তালিকাভুক্ত করেছি।",
  showLess: "কম দেখুন",

         // Footer translations
      moreFromBikroy: "বিক্রয়ের আরও পণ্য",
      sellFast: "দ্রুত বিক্রি করুন",
      membership: "সদস্যপদ",
      bannerAds: "ব্যানার বিজ্ঞাপন",
      boostAds: "বিজ্ঞাপন বুস্ট",
      helpAndSupport: "সাহায্য ও সহায়তা",
      faq: "প্রশ্নাবলী",
      staySafe: "নিরাপদ থাকুন",
      contactUs: "যোগাযোগ করুন",
      aboutBikroy: "বিক্রয় সম্পর্কে",
      aboutUs: "আমাদের সম্পর্কে",
      careers: "ক্যারিয়ার",
      termsAndConditions: "শর্তাবলী",
      privacyPolicy: "গোপনীয়তা নীতি",
      sitemap: "সাইটম্যাপ",
      blogGuides: "ব্লগ এবং নির্দেশিকা",
      carsGuide: "গাড়ির নির্দেশিকা",
      bikesGuide: "বাইকের নির্দেশিকা",
      propertyGuide: "প্রপার্টি নির্দেশিকা",
      officialBlog: "অফিসিয়াল ব্লগ",
      downloadOurApp: "সার্ভিস সেলফ্লিট",
      googlePlay: "ফ্রি বিজ্ঞাপন পোস্ট করুন",
      appStore: "অ্যাকাউন্টের বিবরণ",
      otherCountries: "বিভাগ পরিষেবা",
      sriLanka: "শ্রীলঙ্কা",
      allRightsReserved: "সমস্ত অধিকার সংরক্ষিত",

    //   setings data 
    myAds: "আমার বিজ্ঞাপন",
    myMembership: "আমার সদস্যপদ",
    savedSearches: "সংরক্ষিত অনুসন্ধান",
    favourite: "প্রিয়",
    settings: "সেটিংস",
    phoneNumber: "ফোন নম্বর",

    youHaveNoAds: "আপনার কোনও বিজ্ঞাপন নেই।",
  clickPostAdNow: "এখন বিজ্ঞাপন পোস্ট করতে ক্লিক করুন।",
  postYourAdNow: "আপনার বিজ্ঞাপন পোস্ট করুন!",
becomeMember: "সদস্য হোন",
  membershipDescription: "সদস্যপদ আপনার ব্যবসাকে একটি কণ্ঠ এবং উপস্থিতি দেয়, বিক্রয় বিশ্লেষণ, একটি ব্যবসায়িক পৃষ্ঠা এবং বিজ্ঞাপনের জন্য ডিসকাউন্টেড প্রোমোশনের মতো সরঞ্জামগুলি আনলক করে।",
  noSavedSearches: "আপনার কোনও সংরক্ষিত অনুসন্ধান নেই।",
  savedSearchHint: "কোনও অনুসন্ধান সংরক্ষণ করতে, আপনার অনুসন্ধান ফলাফলের তালিকায় 'সংরক্ষিত অনুসন্ধান' ক্লিক করুন এবং নতুন কিছু যোগ হলে আমরা আপনাকে আপডেট করব।",
  saveSearch: "অনুসন্ধান সংরক্ষণ করুন",
  noFavorites: "আপনি এখনও কোনও বিজ্ঞাপন প্রিয় হিসাবে চিহ্নিত করেননি।",
  clickStarToFavorite: "কোনও বিজ্ঞাপন প্রিয় হিসাবে সংরক্ষণ করতে তারকা চিহ্নে ক্লিক করুন।",
  browseAdsHint: "আপনার পছন্দের বিজ্ঞাপনগুলি খুঁজতে বিজ্ঞাপনগুলি ব্রাউজ করা শুরু করুন।",
  browseAds: "বিজ্ঞাপন ব্রাউজ করুন",
  settingss: "সেটিংস",
  settingsDescription: "এখানে আপনার অ্যাকাউন্ট সেটিংস পরিচালনা করুন।",
  phoneNumbersTitle: "ফোন নম্বর",
    noPhoneNumbers: "আপনার অ্যাকাউন্টে বর্তমানে কোনও ফোন নম্বর যুক্ত নেই।",
    phoneNumbersDescription:
      "ফোন নম্বরগুলি আপনার অ্যাকাউন্টের জন্য অনন্য এবং বিজ্ঞাপন পোস্ট করার বা বিক্রয় পণ্য অর্ডার করার সময় সংগ্রহ করা হবে।",




       
      },

      
    },
  };
  
  

i18n
  .use(LanguageDetector) // Language detection plugin
  .use(initReactI18next) // React integration
  .init({
    resources,
    fallbackLng: "en", // Fallback language
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    detection: {
      // Auto-detection options
      order: ["querystring", "localStorage", "navigator", "cookie"],
      caches: ["localStorage", "cookie"],
    },
    react: {
      useSuspense: false, // Disable suspense for translations
    },
  });

export default i18n;
