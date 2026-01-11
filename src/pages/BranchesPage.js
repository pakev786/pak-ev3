import React from 'react';
import Navbar from '../components/Navbar';

const branches = [
  {
    city: "Head Rajkan",
    holder: "Mr. Jawad Ashraf",
    phone: "3247025901",
    address: "4F5V+VMH PAK EV in the back of ZTBL, Rajkan, Pakistan"
  },
  {
    city: "Karachi",
    holder: "Hafiz Sajjad",
    phone: "3020029229",
    address: "LG-48A Glamour View-1, Smama Bus Stop, University Road, Karachi."
  },
  {
    city: "Lahore",
    holder: "Mr. Waqas Ali",
    phone: "3312416728",
    address: "Pak ev Nishat colony near milad chock nala wali side Lahore"
  },
  {
    city: "Rawalpindi",
    holder: "Mr. Waqas Ali",
    phone: "03318265818", 
    address: "Shop#K19, Bobi Pan Wali Gali, cometee Chock, Main Muree Road Rawalpindi"
  },
  {
    city: "Bahawalpur",
    holder: "Mr. Khubab",
    phone: "3253836600",
    address: "Giri Ganj Bazaar, Mohallah Islampura, Old City, Bahawalpur"
  },
  {
    city: "Sialkot",
    holder: "Mr. Qamar Hussain",
    phone: "03159535444",
    address: "Near Zamzam Bakery Adda Rangpur Puli Gondal Road Sialkot"
  },
  {
    city: "Sargodha",
    holder: "Hafiz Khizr Hayat Shal",
    phone: "3339608605",
    address: "Ahmed Solar & Pak EV Farooq Noori Gate Main Road Farooq Sargodha"
  },
  {
    city: "Faisalabad",
    holder: "Mr. Abu Huraira",
    phone: "3000611830",
    address: "Rasool Park, Near Al-Noor Garden Gate No. #2, Madina Town, Faisalabad"
  },
  {
    city: "Dera Ghazi Khan",
    holder: "Mr. Tahir Iqbal",
    phone: "3346736216",
    address: "Khayaban E Sarwar Block A Near TopSun office Dera Ghazi Khan"
  },
  {
    city: "Charsadda",
    holder: "Mr. Tayyab",
    phone: "3339062638",
    address: "Near Ali plaza mardan road charsadda"
  },
  {
    city: "Bakkar",
    holder: "Mr. Rao Qaiser",
    phone: "3324139152",
    address: "Near Railway Football Ground Tehsil Kalur Kot District Bhakkar"
  },
  {
    city: "Talagang",
    holder: "Mr. Umer",
    phone: "3318265818",
    address: "Minhaj chowk V.p.o Saghar tehsil Talagang disst Talagang"
  },
  {
    city: "Lakkimarwat",
    holder: "Mr. Tanveer Khan",
    phone: "3499619243",
    address: "Workshop No.19 Sarai gambilla bazar Near sarai gambilla pump (kpk) lakki marwat"
  },
  {
    city: "Kotmomin",
    holder: "Mr. Kamran Bilal",
    phone: "3006066398",
    address: "Mashraqi Bazar bhabra Sialvi Attar house"
  },
  {
    city: "Toba Tek Singh",
    holder: "Mr. Asad Virk",
    phone: "3097641402",
    address: "Pak EV Warayam Wala Road Near Rehmat Petroleum Toba Tek Singh"
  },
  {
    city: "Peshawer",
    holder: "Mr. Muhammad Rehman",
    phone: "3339178723",
    address: "Shop No2596 Tipu Sultan Road, Kali Bari Bazar Peshawar Sadder"
  },
  {
    city: "Melsi",
    holder: "Mr. M Shoukat",
    phone: "3003767242",
    address: "Colony Chowk Kahror Pakka, Road fine city town Melsi"
  },
  {
    city: "Sadiqabad",
    holder: "Mr. Javed",
    phone: "3087985302",
    address: "Javed motor workshop near big Bazar sadiqabad"
  },
  {
    city: "Islamabad",
    holder: "Engr Ajmal",
    phone: "3308512718",
    address: ""
  },
  {
    city: "Nowshera",
    holder: "Mr. Waqas Ali",
    phone: "3312416728",
    address: ""
  }
];

export default function BranchesPage() {
  const getWhatsappLink = (number) => {
    const cleanNumber = number.replace(/\D/g, '');
    const formatted = cleanNumber.startsWith('03') ? `92${cleanNumber.substring(1)}` : cleanNumber;
    return `https://wa.me/${formatted}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Branches</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find a Pak EV outlet near you. We are expanding across Pakistan to serve you better.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{branch.city}</h3>
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded">Outlet</span>
              </div>
              
              <div className="space-y-3">
                {branch.holder && (
                  <div className="flex items-start gap-3">
                    <span className="text-gray-400 mt-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </span>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Contact Person</p>
                      <p className="text-gray-800 font-medium">{branch.holder}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                   <span className="text-gray-400 mt-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                   </span>
                   <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Phone</p>
                      {/* Updated: Link to WhatsApp */}
                      <a 
                        href={getWhatsappLink(branch.phone)}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 font-medium hover:underline flex items-center gap-1"
                      >
                        {branch.phone} 
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                      </a>
                   </div>
                </div>

                {branch.address && (
                    <div className="flex items-start gap-3">
                        <span className="text-gray-400 mt-1">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </span>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Address</p>
                            <p className="text-gray-600 text-sm leading-relaxed">{branch.address}</p>
                        </div>
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}