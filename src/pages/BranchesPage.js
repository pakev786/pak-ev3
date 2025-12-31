import React from 'react';
import Navbar from '../components/Navbar';

const branches = [
  {
    city: "Karachi",
    holder: "Hafiz Sajjad",
    phone: "3020029229",
    address: "LG-48A Glamour View-1, Smama Bus Stop, University Road, Karachi."
  },
  {
    city: "Lahore",
    holder: "Waqas Ali",
    phone: "3312416728",
    address: "Pak ev Nishat colony near milad chock nala wali side Lahore"
  },
  {
    city: "Rawalpindi",
    holder: "Waqas Ali",
    phone: "0331-8265818",
    address: "Shop#K19, Bobi Pan Wali Gali, cometee Chock, Main Muree Road Rawalpindi"
  },
  {
    city: "Bahawalpur",
    holder: "Khubab",
    phone: "3253836600",
    address: "Giri Ganj Bazaar, Mohallah Islampura, Old City, Bahawalpur"
  },
  {
    city: "Head Rajkan",
    holder: "Jawad Ashraf",
    phone: "3247025901",
    address: "4F5V+VMH PAK EV in the back of ZTBL, Rajkan, Pakistan"
  },
  {
    city: "Sialkot",
    holder: "Qamar Hussain",
    phone: "0315 9535444",
    address: "Near Zamzam Bakery Adda Rangpur Puli Gondal Road Sialkot"
  },
  {
    city: "Sargodha",
    holder: "Hafiz Khizr Hayat Shal",
    phone: "3339608605 30",
    address: "Ahmed Solar & Pak EV Farooq Noori Gate Main Road Farooq Sargodha"
  },
  {
    city: "Faisalabad",
    holder: "Abu Huraira",
    phone: "3000611830",
    address: "Rasool Park, Near Al-Noor Garden Gate No. #2, Madina Town, Faisalabad"
  },
  {
    city: "Dera Ghazi Khan",
    holder: "Tahir Iqbal",
    phone: "3346736216",
    address: "Khayaban E Sarwar Block A Near TopSun office Dera Ghazi Khan"
  },
  {
    city: "Charsadda",
    holder: "Tayyab",
    phone: "3339062638",
    address: "Near Ali plaza mardan road charsadda"
  },
  {
    city: "Bakkar",
    holder: "Rao Qaiser",
    phone: "3324139152",
    address: "Near Railway Football Ground Tehsil Kalur Kot District Bhakkar"
  },
  {
    city: "Talagang",
    holder: "Umer",
    phone: "3318265818",
    address: "Minhaj chowk V.p.o Saghar tehsil Talagang disst Talagang"
  },
  {
    city: "Lakkimarwat",
    holder: "Tanveer Khan",
    phone: "3499619243",
    address: "Workshop No.19 Sarai gambilla bazar Near sarai gambilla pump (kpk) lakki marwat"
  },
  {
    city: "Kotmomin",
    holder: "Kamran Bilal",
    phone: "3006066398",
    address: "Mashraqi Bazar bhabra Sialvi Attar house"
  },
  {
    city: "Toba Tek Singh",
    holder: "Asad Virk",
    phone: "3097641402",
    address: "Pak EV Warayam Wala Road Near Rehmat Petroleum Toba Tek Singh"
  },
  {
    city: "Peshawer",
    holder: "",
    phone: "3339178723",
    address: "Shop No2596 Tipu Sultan Road, Kali Bari Bazar Peshawar Sadder"
  },
  {
    city: "Melsi",
    holder: "M Shoukat",
    phone: "3003767242",
    address: "Colony Chowk Kahror Pakka, Road fine city town Melsi"
  },
  {
    city: "Sadiqabad",
    holder: "Javeed",
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
    holder: "Waqas Ali",
    phone: "3312416728",
    address: ""
  }
];

export default function BranchesPage() {
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
                      <a href={`tel:${branch.phone}`} className="text-orange-600 font-medium hover:underline">{branch.phone}</a>
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