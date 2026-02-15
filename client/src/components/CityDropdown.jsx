import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const CityDropdown = ({ label, value, onChange, placeholder, exclude }) => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const cities = [
        { name: 'Agartala', code: 'IXA', type: 'Domestic' }, { name: 'Agatti', code: 'AGX', type: 'Island' },
        { name: 'Agra', code: 'AGR', type: 'Tourist' }, { name: 'Ahmedabad', code: 'AMD', type: 'Metro' },
        { name: 'Aizawl', code: 'AJL', type: 'Domestic' }, { name: 'Ajmer (Kishangarh)', code: 'KQH', type: 'Domestic' },
        { name: 'Akola', code: 'AKD', type: 'Domestic' }, { name: 'Allahabad (Prayagraj)', code: 'IXD', type: 'Domestic' },
        { name: 'Amritsar', code: 'ATQ', type: 'International' }, { name: 'Aurangabad', code: 'IXU', type: 'Domestic' },
        { name: 'Ayodhya', code: 'AYJ', type: 'Tourist' }, { name: 'Bagdogra (Siliguri)', code: 'IXB', type: 'Domestic' },
        { name: 'Balurghat', code: 'RGH', type: 'Domestic' }, { name: 'Bangalore (Bengaluru)', code: 'BLR', type: 'Metro' },
        { name: 'Bareilly', code: 'BEK', type: 'Domestic' }, { name: 'Belagavi', code: 'IXG', type: 'Domestic' },
        { name: 'Bellary', code: 'BEP', type: 'Domestic' }, { name: 'Bhopal', code: 'BHO', type: 'Domestic' },
        { name: 'Bhubaneswar', code: 'BBI', type: 'Domestic' }, { name: 'Bhavnagar', code: 'BHU', type: 'Domestic' },
        { name: 'Bhuj', code: 'BHJ', type: 'Domestic' }, { name: 'Bikaner', code: 'BKB', type: 'Domestic' },
        { name: 'Bilaspur', code: 'PAB', type: 'Domestic' }, { name: 'Calicut (Kozhikode)', code: 'CCJ', type: 'International' },
        { name: 'Chandigarh', code: 'IXC', type: 'Metro' }, { name: 'Chennai', code: 'MAA', type: 'Metro' },
        { name: 'Coimbatore', code: 'CJB', type: 'International' }, { name: 'Cooch Behar', code: 'COH', type: 'Domestic' },
        { name: 'Cuddapah (Kadapa)', code: 'CDP', type: 'Domestic' }, { name: 'Darbhanga', code: 'DBR', type: 'Domestic' },
        { name: 'Dehradun', code: 'DED', type: 'Domestic' }, { name: 'Delhi', code: 'DEL', type: 'Metro' },
        { name: 'Dharamshala', code: 'DHM', type: 'Tourist' }, { name: 'Dibrugarh', code: 'DIB', type: 'Domestic' },
        { name: 'Dimapur', code: 'DMU', type: 'Domestic' }, { name: 'Diu', code: 'DIU', type: 'Island' },
        { name: 'Durgapur (Andal)', code: 'RDP', type: 'Domestic' }, { name: 'Gaya', code: 'GAY', type: 'International' },
        { name: 'Goa (Dabolim)', code: 'GOI', type: 'Tourist' }, { name: 'Goa (Mopa)', code: 'GOX', type: 'Tourist' },
        { name: 'Gorakhpur', code: 'GOP', type: 'Domestic' }, { name: 'Guwahati', code: 'GAU', type: 'International' },
        { name: 'Gwalior', code: 'GWL', type: 'Domestic' }, { name: 'Hissar', code: 'HSS', type: 'Domestic' },
        { name: 'Hubballi', code: 'HBX', type: 'Domestic' }, { name: 'Hyderabad', code: 'HYD', type: 'Metro' },
        { name: 'Imphal', code: 'IMF', type: 'Domestic' }, { name: 'Indore', code: 'IDR', type: 'Domestic' },
        { name: 'Itanagar (Hollongi)', code: 'HGI', type: 'Domestic' }, { name: 'Jabalpur', code: 'JLR', type: 'Domestic' },
        { name: 'Jaipur', code: 'JAI', type: 'Tourist' }, { name: 'Jaisalmer', code: 'JSA', type: 'Tourist' },
        { name: 'Jammu', code: 'IXJ', type: 'Domestic' }, { name: 'Jamnagar', code: 'JGA', type: 'Domestic' },
        { name: 'Jamshedpur', code: 'IXW', type: 'Domestic' }, { name: 'Jharsuguda', code: 'JRG', type: 'Domestic' },
        { name: 'Jodhpur', code: 'JDH', type: 'Tourist' }, { name: 'Jorhat', code: 'JRH', type: 'Domestic' },
        { name: 'Kadapa', code: 'CDP', type: 'Domestic' }, { name: 'Kalaburagi', code: 'GBI', type: 'Domestic' },
        { name: 'Kandla', code: 'IXY', type: 'Domestic' }, { name: 'Kanpur', code: 'KNU', type: 'Domestic' },
        { name: 'Kangra (Dharamshala)', code: 'DHM', type: 'Tourist' }, { name: 'Kannur', code: 'CNN', type: 'International' },
        { name: 'Keshod', code: 'IXK', type: 'Domestic' }, { name: 'Khajuraho', code: 'HJR', type: 'Tourist' },
        { name: 'Kochi', code: 'COK', type: 'International' }, { name: 'Kolhapur', code: 'KLH', type: 'Domestic' },
        { name: 'Kolkata', code: 'CCU', type: 'Metro' }, { name: 'Kollam (planned/limited)', code: 'KLM', type: 'Domestic' },
        { name: 'Kota', code: 'KTU', type: 'Domestic' }, { name: 'Kozhikode', code: 'CCJ', type: 'International' },
        { name: 'Kullu (Bhuntar)', code: 'KUU', type: 'Tourist' }, { name: 'Kurnool', code: 'KJB', type: 'Domestic' },
        { name: 'Leh', code: 'IXL', type: 'Tourist' }, { name: 'Lilabari (North Lakhimpur)', code: 'IXL', type: 'Domestic' },
        { name: 'Lucknow', code: 'LKO', type: 'Metro' }, { name: 'Ludhiana', code: 'LUH', type: 'Domestic' },
        { name: 'Madurai', code: 'IXM', type: 'International' }, { name: 'Maharajganj (Kushinagar)', code: 'KBK', type: 'International' },
        { name: 'Mangalore', code: 'IXE', type: 'International' }, { name: 'Mumbai', code: 'BOM', type: 'Metro' },
        { name: 'Mysuru', code: 'MYQ', type: 'Domestic' }, { name: 'Nagpur', code: 'NAG', type: 'Domestic' },
        { name: 'Nanded', code: 'NDC', type: 'Domestic' }, { name: 'Nashik', code: 'ISK', type: 'Domestic' },
        { name: 'Pakyong (Gangtok)', code: 'PYG', type: 'Tourist' }, { name: 'Pantnagar', code: 'PGH', type: 'Domestic' },
        { name: 'Pathankot', code: 'IXP', type: 'Domestic' }, { name: 'Patna', code: 'PAT', type: 'Domestic' },
        { name: 'Porbandar', code: 'PBD', type: 'Domestic' }, { name: 'Port Blair', code: 'IXZ', type: 'Island' },
        { name: 'Puducherry', code: 'PNY', type: 'Tourist' }, { name: 'Pune', code: 'PNQ', type: 'Metro' },
        { name: 'Raipur', code: 'RPR', type: 'Domestic' }, { name: 'Rajahmundry', code: 'RJA', type: 'Domestic' },
        { name: 'Rajkot', code: 'RAJ', type: 'Domestic' }, { name: 'Ranchi', code: 'IXR', type: 'Domestic' },
        { name: 'Rourkela', code: 'RRK', type: 'Domestic' }, { name: 'Salem', code: 'SXV', type: 'Domestic' },
        { name: 'Shillong', code: 'SHL', type: 'Tourist' }, { name: 'Shirdi', code: 'SAG', type: 'Tourist' },
        { name: 'Shivamogga', code: 'RQY', type: 'Domestic' }, { name: 'Silchar', code: 'IXS', type: 'Domestic' },
        { name: 'Solapur', code: 'SSE', type: 'Domestic' }, { name: 'Srinagar', code: 'SXR', type: 'Tourist' },
        { name: 'Surat', code: 'STV', type: 'Domestic' }, { name: 'Tezpur', code: 'TEZ', type: 'Domestic' },
        { name: 'Thanjavur', code: 'TJV', type: 'Domestic' }, { name: 'Thiruvananthapuram', code: 'TRV', type: 'International' },
        { name: 'Tiruchirappalli', code: 'TRZ', type: 'International' }, { name: 'Tirupati', code: 'TIR', type: 'Tourist' },
        { name: 'Tuticorin (Thoothukudi)', code: 'TCR', type: 'Domestic' }, { name: 'Udaipur', code: 'UDR', type: 'Tourist' },
        { name: 'Ujjain (near Indore airport access)', code: 'UJN', type: 'Domestic' }, { name: 'Vadodara', code: 'BDQ', type: 'Domestic' },
        { name: 'Varanasi', code: 'VNS', type: 'Tourist' }, { name: 'Vijayawada', code: 'VGA', type: 'Domestic' },
        { name: 'Visakhapatnam', code: 'VTZ', type: 'Domestic' }, { name: 'Warangal', code: 'WGL', type: 'Domestic' },
    ].sort((a, b) => a.name.localeCompare(b.name));

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCities = cities.filter(c =>
        (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
        c.name !== exclude
    );

    return (
        <div className={`relative ${i18n.language === 'ur' ? 'rtl' : 'ltr'}`} ref={dropdownRef} dir={i18n.language === 'ur' ? 'rtl' : 'ltr'}>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-xl cursor-pointer border-2 transition-all flex items-center justify-between ${isOpen ? 'border-primary' : 'border-transparent hover:border-gray-200 dark:hover:border-slate-500'}`}
            >
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400 dark:text-gray-500 tracking-wider font-bold">{t('city_dropdown.city_airport')}</span>
                    <span className="font-bold text-lg text-gray-800 dark:text-white">{value || <span className="text-gray-400 dark:text-gray-500 font-normal">{placeholder}</span>}</span>
                </div>
                <div className="bg-white dark:bg-slate-600 p-2 rounded-lg shadow-sm">
                    <Plane size={16} className="text-gray-400 dark:text-gray-300 transform -rotate-45 rtl:rotate-45" />
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-600 overflow-hidden">
                        <div className="p-3 border-b border-gray-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800">
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-600">
                                <Search size={16} className="text-gray-400 dark:text-gray-300" />
                                <input
                                    type="text" autoFocus placeholder={t('city_dropdown.search_placeholder')}
                                    className="bg-transparent border-none focus:outline-none w-full text-sm font-medium text-gray-800 dark:text-white"
                                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                            {filteredCities.map((c, i) => (
                                <div key={i} onClick={() => { onChange(c.name); setIsOpen(false); setSearchTerm(''); }} className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer flex justify-between items-center group border-b border-gray-50 dark:border-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 group-hover:text-blue-600 dark:group-hover:text-blue-400"><MapPin size={16} /></div>
                                        <div><div className="font-bold text-gray-800 dark:text-white">{c.name}</div><div className="text-xs text-gray-500 dark:text-gray-400">India • {c.type}</div></div>
                                    </div>
                                    <span className="font-mono font-bold text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 border border-gray-200 dark:border-slate-600 px-2 py-1 rounded text-xs">{c.code}</span>
                                </div>
                            ))}
                            {searchTerm.length > 0 && (
                                <div onClick={() => { onChange(searchTerm); setIsOpen(false); setSearchTerm(''); }} className="p-4 text-center text-blue-600 dark:text-blue-400 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 font-bold border-t border-gray-100 dark:border-slate-700 flex items-center justify-center gap-2">
                                    <Search size={14} /> {t('city_dropdown.custom_city', { city: searchTerm })}
                                </div>
                            )}
                            <div className="p-2 text-center text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800">{t('city_dropdown.showing_cities', { count: filteredCities.length })}</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CityDropdown;
