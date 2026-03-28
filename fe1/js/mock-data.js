/* ═══════════════════════════════════════════
   atonota Studio — Mock Data Generators
   Realistic Turkish SEO/ads mock data for prototype
═══════════════════════════════════════════ */

const MOCK = {
  // --- Keyword generator ---
  keywords: {
    seeds: {
      'dijital pazarlama': ['dijital pazarlama ajansi','dijital pazarlama kursu','dijital pazarlama nedir','dijital pazarlama stratejileri','dijital pazarlama egitimi','dijital pazarlama uzmani','dijital pazarlama firmalari','online pazarlama','internet pazarlama','sosyal medya pazarlama'],
      'seo': ['seo nedir','seo uzmani','seo ajansi','seo analizi','seo araci','seo egitimi','seo danismanligi','seo optimizasyonu','seo fiyatlari','teknik seo','yerel seo','seo stratejisi','seo ipuclari','seo raporu'],
      'e-ticaret': ['e-ticaret sitesi','e-ticaret platformu','e-ticaret danismanligi','online magaza','e-ticaret paketleri','e-ticaret yazilimi','e-ticaret seo','e-ticaret trendleri','e-ticaret entegrasyonu'],
      'web tasarim': ['web tasarim fiyatlari','web sitesi tasarimi','web tasarim ajansi','responsive tasarim','ui ux tasarim','web gelistirme','wordpress tasarim','kurumsal web sitesi'],
      'reklam': ['google ads','facebook reklam','instagram reklam','tiktok reklam','dijital reklam','reklam ajansi','reklam butcesi','reklam yonetimi','ppc reklam','sosyal medya reklam'],
    },
    intents: ['Bilgi','Ticari','Nav','Islem'],
    intentColors: {Bilgi:'#3b82f6',Ticari:'#a855f7',Nav:'#22c55e',Islem:'#ef4444'},

    generate(seed, count=50) {
      const base = this.seeds[seed] || this.seeds['seo'];
      const result = [];
      for (let i = 0; i < Math.min(count, 100); i++) {
        const kw = i < base.length ? base[i] : base[i % base.length] + ' ' + (2024 + Math.floor(i/10));
        const intent = this.intents[Math.floor(Math.random()*4)];
        result.push({
          keyword: kw,
          intent,
          volume: Math.floor(Math.random()*30000) + 100,
          cpc: +(Math.random()*8 + 0.2).toFixed(2),
          kd: Math.floor(Math.random()*100),
          position: Math.floor(Math.random()*50) + 1,
          change: Math.floor(Math.random()*10) - 5,
          clicks: Math.floor(Math.random()*5000),
          trafficValue: Math.floor(Math.random()*15000),
          trafficPotential: Math.floor(Math.random()*20000) + 500,
          trend: Array.from({length:12}, ()=>Math.floor(Math.random()*1000)+100),
          serpFeatures: ['Featured Snippet','PAA','AIO','Video','Image','Sitelink'].filter(()=>Math.random()>0.7),
        });
      }
      return result.sort((a,b) => b.volume - a.volume);
    },
  },

  // --- Backlink generator ---
  backlinks: {
    domains: ['medium.com','forbes.com','techcrunch.com','webrazzi.com','shiftdelete.net','donanimhaber.com','chip.com.tr','log.com.tr','pazarlamasyon.com','sosyalmedya.co','dijitalajanslar.com','startupturk.com','girisimsepeti.com','egitimsepeti.com','kariyer.net'],
    generate(count=50) {
      const result = [];
      for (let i = 0; i < count; i++) {
        const domain = this.domains[i % this.domains.length] || `site${i}.com`;
        result.push({
          domain,
          dr: Math.floor(Math.random()*80) + 10,
          ur: Math.floor(Math.random()*70) + 5,
          backlinks: Math.floor(Math.random()*500) + 1,
          type: Math.random() > 0.2 ? 'Dofollow' : 'Nofollow',
          anchor: ['brand','exact','partial','generic','naked'][Math.floor(Math.random()*5)],
          firstSeen: `2025-${String(Math.floor(Math.random()*12)+1).padStart(2,'0')}-${String(Math.floor(Math.random()*28)+1).padStart(2,'0')}`,
          toxic: Math.random() > 0.85,
          status: Math.random() > 0.1 ? 'Aktif' : 'Kayip',
        });
      }
      return result.sort((a,b) => b.dr - a.dr);
    },
  },

  // --- Audit issue generator ---
  audit: {
    categories: ['Crawlability','HTTPS','Hiz','Dahili Link','Meta Tag','Icerik','Resim','Schema','Mobile','Erisilebilirlik'],
    severities: ['Kritik','Uyari','Bilgi'],
    issues: [
      {title:'Broken internal links (404)',cat:'Crawlability',sev:'Kritik',fix:'404 sayfalar icin redirect olusturun'},
      {title:'Missing H1 tag',cat:'Meta Tag',sev:'Uyari',fix:'Her sayfada tek H1 etiketi kullanin'},
      {title:'Duplicate title tags',cat:'Meta Tag',sev:'Uyari',fix:'Her sayfa icin benzersiz title yazin'},
      {title:'Missing alt attributes',cat:'Resim',sev:'Bilgi',fix:'Tum gorsellere alt text ekleyin'},
      {title:'Slow page load (>3s)',cat:'Hiz',sev:'Kritik',fix:'Gorsel boyutlarini optimize edin'},
      {title:'Missing meta description',cat:'Meta Tag',sev:'Uyari',fix:'Her sayfa icin 150-160 karakter meta description yazin'},
      {title:'Mixed content (HTTP on HTTPS)',cat:'HTTPS',sev:'Kritik',fix:'Tum kaynaklari HTTPS uzerinden yukleyin'},
      {title:'Orphan pages (no internal links)',cat:'Dahili Link',sev:'Uyari',fix:'Dahili link yapisi olusturun'},
      {title:'Thin content (<300 words)',cat:'Icerik',sev:'Bilgi',fix:'Icerik derinligini artirin'},
      {title:'Missing schema markup',cat:'Schema',sev:'Bilgi',fix:'JSON-LD schema ekleyin'},
      {title:'Redirect chains',cat:'Crawlability',sev:'Uyari',fix:'Redirect zincirlerini tekil redirect ile degistirin'},
      {title:'Missing viewport meta',cat:'Mobile',sev:'Kritik',fix:'Viewport meta tag ekleyin'},
      {title:'Low contrast text',cat:'Erisilebilirlik',sev:'Bilgi',fix:'Metin kontrastini 4.5:1 oranina cikarin'},
      {title:'Broken external links',cat:'Crawlability',sev:'Bilgi',fix:'Kisa linklerini guncelleyin veya kaldirin'},
      {title:'Missing canonical tag',cat:'Meta Tag',sev:'Uyari',fix:'Canonical URL tanimlayarak duplicate icerigi onleyin'},
    ],
    generate(count=50) {
      const result = [];
      for (let i = 0; i < count; i++) {
        const issue = this.issues[i % this.issues.length];
        result.push({
          ...issue,
          id: i+1,
          affected: Math.floor(Math.random()*50)+1,
          url: `/sayfa-${Math.floor(Math.random()*200)+1}`,
        });
      }
      return result;
    },
  },

  // --- Traffic data generator ---
  traffic: {
    generate(days=30) {
      const result = [];
      const now = new Date();
      for (let i = days; i >= 0; i--) {
        const d = new Date(now - i*86400000);
        const dow = d.getDay();
        const weekendFactor = (dow===0||dow===6) ? 0.6 : 1;
        const trendFactor = 1 + (days-i)*0.005;
        result.push({
          date: d.toISOString().slice(0,10),
          organic: Math.floor((800+Math.random()*400)*weekendFactor*trendFactor),
          paid: Math.floor((200+Math.random()*150)*weekendFactor),
          referral: Math.floor((150+Math.random()*100)*weekendFactor),
          direct: Math.floor((100+Math.random()*80)*weekendFactor),
        });
      }
      return result;
    },
  },

  // --- Competitor data ---
  competitors: {
    generate(count=5) {
      const names = ['rakip1.com','rakip2.com','rakip3.com','rakip4.com','rakip5.com'];
      return names.slice(0,count).map((name,i) => ({
        domain: name,
        dr: 40 + Math.floor(Math.random()*40),
        traffic: Math.floor(Math.random()*80000)+5000,
        keywords: Math.floor(Math.random()*5000)+200,
        backlinks: Math.floor(Math.random()*20000)+500,
        overlap: Math.floor(Math.random()*500)+50,
        trend: Math.random()>0.5 ? 'up' : 'down',
        techStack: ['WordPress','Cloudflare','GA4','Yoast SEO','GTM'].slice(0,3+Math.floor(Math.random()*3)),
      }));
    },
  },
};

// --- Utility functions ---
function getChartTheme() {
  return {
    text: '#F2EDE5',
    muted: '#7B7269',
    border: '#3C342C',
    bg: '#201C18',
    accent: '#C2410C',
    accentSoft: 'rgba(194,65,12,0.15)',
    green: '#22c55e',
    red: '#ef4444',
    blue: '#3b82f6',
    yellow: '#eab308',
    purple: '#a855f7',
    tooltip: {backgroundColor:'#201C18',borderColor:'#3C342C',textStyle:{color:'#F2EDE5',fontSize:12}},
  };
}

function exportToCSV(headers, rows, filename='export.csv') {
  const csv = [headers.join(','), ...rows.map(r=>r.map(c=>`"${c}"`).join(','))].join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function paginate(data, page, perPage=20) {
  const total = data.length;
  const pages = Math.ceil(total/perPage);
  const start = (page-1)*perPage;
  return {
    items: data.slice(start, start+perPage),
    page, perPage, total, pages,
    hasNext: page < pages,
    hasPrev: page > 1,
    showing: `${start+1}-${Math.min(start+perPage, total)} / ${total}`,
  };
}

function sparkline(containerId, data, color='#C2410C', w=80, h=28) {
  const c = echarts.init(document.getElementById(containerId), null, {width:w, height:h});
  c.setOption({
    grid:{left:0,right:0,top:0,bottom:0},
    xAxis:{show:false,type:'category',data:data.map((_,i)=>i)},
    yAxis:{show:false,type:'value'},
    series:[{type:'line',data,symbol:'none',lineStyle:{color,width:1.5},areaStyle:{color:{type:'linear',x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:color+'33'},{offset:1,color:'transparent'}]}}}],
  });
  return c;
}
