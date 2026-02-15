import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Globe, Sun, Moon, User, LogOut, LayoutDashboard, Plane, Hotel, CloudSun, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Lock body scroll when menu is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.style.overflow = 'unset'; // Cleanup
        };
    }, [isOpen]);

    // Check if user has active bookings for Analytics access
    const hasBookings = () => {
        if (!user) return false;
        try {
            const bookingKey = `travelEase_bookings_${user.id}`;
            const bookings = JSON.parse(localStorage.getItem(bookingKey) || '[]');
            return bookings.length > 0;
        } catch (e) {
            return false;
        }
    };

    const handleLogoutClick = () => {
        setShowFeedback(true);
        setIsOpen(false);
    };

    const handleLogoutConfirm = () => {
        logout();
        setShowFeedback(false);
        navigate('/');
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
        setShowLangMenu(false);
        setIsOpen(false);
    };

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'हिंदी' },
        { code: 'bn', label: 'বাংলা' },
        { code: 'te', label: 'తెలుగు' },
        { code: 'mr', label: 'मराठी' },
        { code: 'ta', label: 'தமிழ்' },
        { code: 'ur', label: 'اردو' },
        { code: 'gu', label: 'ગુજરાતી' },
        { code: 'kn', label: 'ಕನ್ನಡ' },
        { code: 'ml', label: 'മലയാളം' },
        { code: 'pa', label: 'ਪੰਜਾਬੀ' },
        { code: 'as', label: 'অসমীয়া' },
        { code: 'or', label: 'ଓଡ଼ିଆ' }
    ];

    const navLinks = [
        { name: t('navbar.home') || 'Home', path: '/' },
        { name: t('navbar.flights') || 'Flights', path: '/flights', icon: <Plane size={16} /> },
        { name: t('navbar.hotels') || 'Hotels', path: '/hotels', icon: <Hotel size={16} /> },
    ];

    if (user) {
        navLinks.push({ name: t('navbar.my_bookings') || 'My Bookings', path: '/my-bookings' });
        if (hasBookings()) {
            navLinks.push({ name: t('navbar.smart_predictions') || 'Smart Trip Predictions', path: '/dashboard', icon: <Sparkles size={16} /> });
            navLinks.push({ name: t('navbar.analytics') || 'Analytics', path: '/analytics', icon: <TrendingUp size={16} /> });
        }
    }

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || isOpen ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-gradient-to-tr from-primary to-secondary p-2 rounded-xl group-hover:scale-105 transition-transform">
                                <Plane className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                TravelEase
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path
                                        ? 'text-primary'
                                        : 'text-gray-700 dark:text-gray-200'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        {link.icon}
                                        {link.name}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {/* Right Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-200"
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            {/* Language Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowLangMenu(!showLangMenu)}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-200"
                                >
                                    <Globe size={20} />
                                </button>
                                {showLangMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden py-1 max-h-64 overflow-y-auto custom-scrollbar">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => changeLanguage(lang.code)}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 ${i18n.language === lang.code
                                                    ? 'text-primary font-bold bg-primary/5'
                                                    : 'text-gray-700 dark:text-gray-200'
                                                    }`}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Auth Buttons */}
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 pl-2 pr-4 py-1.5 rounded-full">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {user.name ? user.name[0].toUpperCase() : <User size={16} />}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                                            {user.name || 'User'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogoutClick}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                        title={t('navbar.logout') || "Logout"}
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-secondary transition-colors shadow-lg shadow-primary/20"
                                >
                                    {t('navbar.login') || 'Login'}
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-2">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-200"
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 text-gray-700 dark:text-gray-200"
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 fixed inset-0 top-[72px] z-[60] overflow-y-auto shadow-xl h-[calc(100vh-72px)]">
                        <div className="px-4 py-8 space-y-4 pb-24">
                            {user && (
                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {user.name ? user.name[0].toUpperCase() : <User size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                            )}

                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block text-lg font-medium ${location.pathname === link.path
                                        ? 'text-primary'
                                        : 'text-gray-700 dark:text-gray-200'
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        {link.icon}
                                        {link.name}
                                    </span>
                                </Link>
                            ))}

                            <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Language</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`text-left px-3 py-2 rounded-lg text-sm ${i18n.language === lang.code
                                                ? 'bg-primary/10 text-primary font-bold'
                                                : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4">
                                {user ? (
                                    <button
                                        onClick={handleLogoutClick}
                                        className="w-full bg-red-50 dark:bg-red-900/20 text-red-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                                    >
                                        <LogOut size={18} /> {t('navbar.logout') || 'Logout'}
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full bg-primary text-white text-center py-3 rounded-xl font-bold"
                                    >
                                        {t('navbar.login') || 'Login'}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <FeedbackModal
                isOpen={showFeedback}
                onClose={() => setShowFeedback(false)}
                userId={user?.id}
                onLogout={handleLogoutConfirm}
            />
        </>
    );
};

export default Navbar;
