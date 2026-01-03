'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  FolderOpen, 
  GraduationCap, 
  Users, 
  ShoppingCart, 
  Package,
  Upload,
  Image as ImageIcon,
  Grid3x3,
  List,
  Eye,
  FileText,
  ExternalLink,
  LogOut,
  Home,
  Menu,
  User,
  X,
  Maximize,
  Minimize,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { ToastContainer, Toast, ToastType } from '@/components/Toast';

type ActiveTab = 'dashboard' | 'portfolio' | 'team' | 'shop' | 'academy' | 'orders' | 'inquiries';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const showToast = (message: string, type: ToastType = 'info', duration: number = 5000) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);
  };
  
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Confirmation modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmAction, setDeleteConfirmAction] = useState<(() => void) | null>(null);
  const [deleteConfirmMessage, setDeleteConfirmMessage] = useState('');

  const showDeleteConfirmation = (message: string, onConfirm: () => void) => {
    setDeleteConfirmMessage(message);
    setDeleteConfirmAction(() => onConfirm);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmAction) {
      deleteConfirmAction();
    }
    setShowDeleteConfirm(false);
    setDeleteConfirmAction(null);
    setDeleteConfirmMessage('');
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteConfirmAction(null);
    setDeleteConfirmMessage('');
  };

  // Image states for various sections
  const [portfolioImage, setPortfolioImage] = useState('');
  const [academyImage, setAcademyImage] = useState('');
  const [teamImage, setTeamImage] = useState('');
  const [shopImage, setShopImage] = useState('');
  // PDF state for academic section
  const [pdfLink, setPdfLink] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  
  // Company profile PDF state
  const [companyProfilePdf, setCompanyProfilePdf] = useState('');
  const [companyProfilePdfFile, setCompanyProfilePdfFile] = useState<File | null>(null);
  
  // Social media links state
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: ''
  });
  const [showSocialNotification, setShowSocialNotification] = useState(false);
  
  // Partners logos state
  const [partnerLogos, setPartnerLogos] = useState<any[]>([]);
  const [newPartnerLogo, setNewPartnerLogo] = useState('');
  
  // Portfolio management state
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<string | null>(null);
  const [portfolioView, setPortfolioView] = useState<'grid' | 'list'>('grid');
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioCategory, setPortfolioCategory] = useState('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [portfolioYear, setPortfolioYear] = useState('');
  const [portfolioDescription, setPortfolioDescription] = useState('');
  const [portfolioArea, setPortfolioArea] = useState('');
  const [portfolioClient, setPortfolioClient] = useState('');
  const [portfolioStatus, setPortfolioStatus] = useState('');
  const [portfolioLocation, setPortfolioLocation] = useState('');
  const [portfolioKeyFeatures, setPortfolioKeyFeatures] = useState<string[]>([]);
  const [newKeyFeature, setNewKeyFeature] = useState('');
  const [portfolioGallery, setPortfolioGallery] = useState<string[]>([]);
  
  // Team management state
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamPosition, setTeamPosition] = useState('');
  const [teamCategory, setTeamCategory] = useState<string[]>([]);
  const [teamCategories, setTeamCategories] = useState<string[]>([]);
  const [copyFromMember, setCopyFromMember] = useState<string>('');
  const [teamPhone, setTeamPhone] = useState('');
  const [teamLinkedin, setTeamLinkedin] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [teamExperience, setTeamExperience] = useState('');
  const [teamEducation, setTeamEducation] = useState('');
  const [teamCertification, setTeamCertification] = useState('');
  
  // Shop management state
  const [showShopForm, setShowShopForm] = useState(false);
  const [editingShop, setEditingShop] = useState<string | null>(null);
  const [shopName, setShopName] = useState('');
  const [shopPrice, setShopPrice] = useState('');
  const [shopCategory, setShopCategory] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  
  // Academy management state
  const [showAcademyForm, setShowAcademyForm] = useState(false);
  const [editingAcademy, setEditingAcademy] = useState<string | null>(null);
  const [academicTitle, setAcademicTitle] = useState('');
  const [academicAuthor, setAcademicAuthor] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [academicDescription, setAcademicDescription] = useState('');
  const [academicLink, setAcademicLink] = useState('');
  
  // PDF Viewer state
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pdfViewerRef = useRef<HTMLDivElement>(null);
  
  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);
  
  // Payment method management state
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<string | null>(null);
  const [paymentName, setPaymentName] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [paymentAccountName, setPaymentAccountName] = useState('');
  const [paymentAccountNumber, setPaymentAccountNumber] = useState('');
  const [paymentProvider, setPaymentProvider] = useState('');
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [paymentIsActive, setPaymentIsActive] = useState(true);
  
  // Orders management state
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  
  // Inquiries management state
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  
  // Data from database
  const [teams, setTeams] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch data from database
  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData();
    }
  }, [isLoggedIn]);
  
  // Populate portfolio form when editing
  useEffect(() => {
    if (editingPortfolio && portfolios.length > 0) {
      const portfolio = portfolios.find(p => (p._id || p.id) === editingPortfolio);
      if (portfolio) {
        setPortfolioTitle(portfolio.title || '');
        const category = portfolio.category || '';
        setPortfolioCategory(category);
        // Check if category exists in available categories
        if (category && availableCategories.length > 0 && !availableCategories.includes(category)) {
          setIsNewCategory(true);
          setNewCategoryName(category);
        } else if (category && availableCategories.includes(category)) {
          setIsNewCategory(false);
          setNewCategoryName('');
        } else {
          setIsNewCategory(false);
          setNewCategoryName('');
        }
        setPortfolioYear(portfolio.year || '');
        setPortfolioDescription(portfolio.description || '');
        setPortfolioArea(portfolio.area || '');
        setPortfolioClient(portfolio.client || '');
        setPortfolioStatus(portfolio.status || '');
        setPortfolioLocation(portfolio.location || '');
        // Parse key features from string to array
        const keyFeaturesStr = portfolio.keyFeatures || '';
        const keyFeaturesArray = keyFeaturesStr
          ? keyFeaturesStr.split(/[\n,]+/).map((f: string) => f.trim()).filter((f: string) => f)
          : [];
        setPortfolioKeyFeatures(keyFeaturesArray);
        setPortfolioImage(portfolio.image || '');
        setPortfolioGallery(Array.isArray(portfolio.gallery) ? portfolio.gallery : []);
      }
    } else if (!editingPortfolio) {
      // Reset form when not editing
      setPortfolioTitle('');
      setPortfolioCategory('');
      setIsNewCategory(false);
      setNewCategoryName('');
      setPortfolioYear('');
      setPortfolioDescription('');
      setPortfolioArea('');
      setPortfolioClient('');
      setPortfolioStatus('');
      setPortfolioLocation('');
      setPortfolioKeyFeatures([]);
      setNewKeyFeature('');
      setPortfolioImage('');
      setPortfolioGallery([]);
    }
  }, [editingPortfolio, portfolios, availableCategories]);

  // Populate shop form when editing
  useEffect(() => {
    if (editingShop && products.length > 0) {
      const product = products.find(p => (p._id || p.id) === editingShop);
      if (product) {
        setShopName(product.name || '');
        setShopPrice(product.price || '');
        setShopCategory(product.category || '');
        setShopDescription(product.description || '');
        setShopImage(product.image || '');
      }
    } else if (!editingShop) {
      // Reset form when not editing
      setShopName('');
      setShopPrice('');
      setShopCategory('');
      setShopDescription('');
      setShopImage('');
    }
  }, [editingShop, products]);

  // Populate payment form when editing
  useEffect(() => {
    if (editingPayment && paymentMethods.length > 0) {
      const method = paymentMethods.find(m => (m._id || m.id) === editingPayment);
      if (method) {
        setPaymentName(method.name || '');
        setPaymentType(method.type || '');
        setPaymentAccountName(method.accountName || '');
        setPaymentAccountNumber(method.accountNumber || '');
        setPaymentProvider(method.provider || '');
        setPaymentInstructions(method.instructions || '');
        setPaymentIsActive(method.isActive !== false);
      }
    } else if (!editingPayment) {
      // Reset form when not editing
      setPaymentName('');
      setPaymentType('');
      setPaymentAccountName('');
      setPaymentAccountNumber('');
      setPaymentProvider('');
      setPaymentInstructions('');
      setPaymentIsActive(true);
    }
  }, [editingPayment, paymentMethods]);
  
  const fetchAllData = async () => {
    try {
      setLoading(true);
        const [teamsRes, productsRes, publicationsRes, portfoliosRes, socialRes, partnersRes, paymentRes, ordersRes, inquiriesRes] = await Promise.all([
        fetch('/api/team'),
        fetch('/api/shop'),
        fetch('/api/academic'),
        fetch('/api/portfolio'),
        fetch('/api/social'),
          fetch('/api/partners'),
          fetch('/api/payment'),
          fetch('/api/order'),
          fetch('/api/inquiry')
      ]);
      
      const teamsData = await teamsRes.json();
      const productsData = await productsRes.json();
      const publicationsData = await publicationsRes.json();
      const portfoliosData = await portfoliosRes.json();
      const socialData = await socialRes.json();
      const partnersData = await partnersRes.json();
      const paymentData = await paymentRes.json();
      const ordersData = await ordersRes.json();
      const inquiriesData = await inquiriesRes.json();
      
      // Ensure teams have proper IDs
      const teamsWithIds = (teamsData || []).map((team: any) => {
        // Extract ID - handle various formats (string, object with toString, etc.)
        let id = team._id || team.id;
        
        // If ID is an object (like MongoDB ObjectId), convert it to string
        if (id && typeof id === 'object') {
          id = id.toString ? id.toString() : String(id);
        } else if (id) {
          id = String(id);
        }
        
        if (!id || id === 'undefined' || id === 'null') {
          return null;
        }
        
        return {
          ...team,
          id: id.trim(),
          _id: id.trim()
        };
      }).filter((team: any) => team && team.id); // Filter out teams without IDs
      // Teams loaded successfully
      setTeams(teamsWithIds);
      
      // Extract unique categories from teams for multi-select
      const teamCategoriesSet = new Set<string>();
      teamsWithIds.forEach((team: any) => {
        const categories = Array.isArray(team.category) ? team.category : (team.category ? [team.category] : ['Uncategorized']);
        categories.forEach((cat: string) => {
          if (cat && cat.trim()) {
            teamCategoriesSet.add(cat.trim());
          }
        });
      });
      setTeamCategories(Array.from(teamCategoriesSet).sort());
      setProducts(productsData || []);
      setPublications(publicationsData || []);
      setPortfolios(portfoliosData || []);
      setPaymentMethods(paymentData || []);
      setOrders(ordersData || []);
      setInquiries(inquiriesData || []);
      
      // Extract unique categories from portfolios
      const uniqueCategories = new Set<string>();
      (portfoliosData || []).forEach((portfolio: any) => {
        if (portfolio.category && portfolio.category.trim()) {
          uniqueCategories.add(portfolio.category.trim());
        }
      });
      const sortedCategories = Array.from(uniqueCategories).sort();
      setAvailableCategories(sortedCategories);
      if (socialData) {
        setSocialLinks({
          facebook: socialData.facebook || '',
          twitter: socialData.twitter || '',
          linkedin: socialData.linkedin || '',
          instagram: socialData.instagram || ''
        });
        if (socialData.companyProfilePdf) {
          setCompanyProfilePdf(socialData.companyProfilePdf);
        }
      }
      if (partnersData) setPartnerLogos(partnersData);
    } catch (error) {
      // Error fetching data
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple login credentials
    if (username.trim() === 'admin' && password.trim() === 'admin') {
      setIsLoggedIn(true);
    } else {
      showToast('Invalid credentials. Use: admin / admin', 'error');
    }
  };

  // Save functions for database operations
  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioTitle || !portfolioCategory || !portfolioYear || !portfolioDescription || !portfolioImage) {
      showToast('Please fill in all required fields (Title, Category, Year, Description, Image)', 'warning');
      return;
    }
    try {
      const data = {
        title: portfolioTitle,
        category: portfolioCategory,
        year: portfolioYear,
        location: portfolioLocation,
        description: portfolioDescription,
        image: portfolioImage,
        gallery: portfolioGallery.filter(img => img.trim() !== ''),
        area: portfolioArea,
        client: portfolioClient,
        status: portfolioStatus || 'Completed',
        keyFeatures: portfolioKeyFeatures.join('\n')
      };
      const url = editingPortfolio ? `/api/portfolio/${editingPortfolio}` : '/api/portfolio';
      const method = editingPortfolio ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        // Add new category to available categories if it doesn't exist
        if (portfolioCategory && !availableCategories.includes(portfolioCategory)) {
          setAvailableCategories([...availableCategories, portfolioCategory].sort());
        }
        await fetchAllData();
        setShowPortfolioForm(false);
        setEditingPortfolio(null);
        // Reset form
        setPortfolioTitle('');
        setPortfolioCategory('');
        setIsNewCategory(false);
        setNewCategoryName('');
        setPortfolioYear('');
        setPortfolioDescription('');
        setPortfolioArea('');
        setPortfolioClient('');
        setPortfolioStatus('');
        setPortfolioLocation('');
        setPortfolioKeyFeatures([]);
        setNewKeyFeature('');
        setPortfolioImage('');
        setPortfolioGallery([]);
      } else {
        const errorData = await res.json();
        showToast(`Error: ${errorData.error || 'Failed to save portfolio'}`, 'error');
      }
    } catch (error) {
      console.error('Error saving portfolio:', error);
      showToast('Error saving portfolio. Please try again.', 'error');
    }
  };

  const deletePortfolio = async (id: string) => {
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchAllData();
        showToast('Portfolio deleted successfully', 'success');
      } else {
        showToast('Failed to delete portfolio', 'error');
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      showToast('Error deleting portfolio. Please try again.', 'error');
    }
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !teamPosition || !teamImage) {
      showToast('Please fill in all required fields (Name, Position, Image)', 'warning');
      return;
    }
    
    // Validate ID if editing
    if (editingTeam) {
      // Convert to string and validate
      const teamId = String(editingTeam).trim();
      if (!teamId || teamId === 'undefined' || teamId === 'null' || teamId === '') {
        showToast('Error: Invalid team member ID. Please try refreshing the page.', 'error');
        // Invalid team ID
        return;
      }
      // MongoDB ObjectId should be 24 hex characters
      if (!/^[0-9a-fA-F]{24}$/.test(teamId)) {
        showToast('Error: Team member ID format is invalid. Please try refreshing the page.', 'error');
        // Invalid ObjectId format
        return;
      }
    }
    
    try {
      const data = {
        name: teamName.trim(),
        position: teamPosition.trim(),
        category: Array.isArray(teamCategory) && teamCategory.length > 0 ? teamCategory : ['Uncategorized'],
        image: teamImage.trim(),
        phone: teamPhone?.trim() || '',
        linkedin: teamLinkedin?.trim() || '',
        description: teamDescription?.trim() || '',
        experience: teamExperience?.trim() || '',
        education: teamEducation?.trim() || '',
        certification: teamCertification?.trim() || ''
      };
      const teamId = editingTeam ? String(editingTeam).trim() : null;
      const url = teamId ? `/api/team/${teamId}` : '/api/team';
      const method = teamId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchAllData();
        setShowTeamForm(false);
        setEditingTeam(null);
        // Reset form
        setTeamName('');
        setTeamPosition('');
        setTeamCategory([]);
        setTeamPhone('');
        setTeamLinkedin('');
        setTeamDescription('');
        setTeamExperience('');
        setTeamEducation('');
        setTeamCertification('');
        setTeamImage('');
      } else {
        // Try to get error message from response
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
            errorMessage = errorData.error || errorData.message || errorData.msg || errorMessage;
          } else {
            const errorText = await res.text();
            errorMessage = errorText || errorMessage;
          }
        } catch (parseError) {
          // Error parsing response
        }
        showToast(`Error: ${errorMessage}`, 'error');
      }
    } catch (error) {
      // Error saving team
      showToast('Error saving team member. Please try again.', 'error');
    }
  };

  const deleteTeam = async (id: string) => {
    const teamId = String(id || '').trim();
    
    if (!teamId || teamId === 'undefined' || teamId === 'null' || teamId === '') {
      showToast('Error: Invalid team member ID', 'error');
      return;
    }
    
    if (teamId.length < 1) {
      showToast('Error: Invalid team member ID format - ID is too short', 'error');
      return;
    }
    
    try {
      const deleteUrl = `/api/team/${teamId}`;
      const res = await fetch(deleteUrl, { method: 'DELETE' });
      if (res.ok) {
        await fetchAllData();
        showToast('Team member deleted successfully', 'success');
      } else {
        // Try to get error message from response
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            errorMessage = errorData.error || errorData.message || errorData.msg || errorMessage;
          } else {
            const errorText = await res.text();
            errorMessage = errorText || errorMessage;
          }
        } catch (parseError) {
          // Error parsing delete error response
        }
        showToast(`Error deleting team member: ${errorMessage}`, 'error');
      }
    } catch (error) {
      // Error deleting team
      showToast('Error deleting team member. Please try again.', 'error');
    }
  };

  const handleSaveShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !shopPrice || !shopCategory || !shopImage) {
      showToast('Please fill in all required fields (Name, Price, Category, Image)', 'warning');
      return;
    }
    try {
      const data = {
        name: shopName.trim(),
        price: shopPrice.trim(),
        category: shopCategory.trim(),
        description: shopDescription.trim(),
        image: shopImage
      };
      
      const url = editingShop ? `/api/shop/${editingShop}` : '/api/shop';
      const method = editingShop ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      console.log('Response status:', res.status, res.statusText);
      
      const contentType = res.headers.get('content-type');
      
      if (res.ok) {
        // Parse response to ensure it's valid
        let responseData;
        if (contentType && contentType.includes('application/json')) {
          responseData = await res.json();
        } else {
          const text = await res.text();
          try {
            responseData = JSON.parse(text);
          } catch (e) {
            // Response is not JSON, but status is OK
          }
        }
        
        await fetchAllData();
        setShowShopForm(false);
        setEditingShop(null);
        // Reset form
        setShopName('');
        setShopPrice('');
        setShopCategory('');
        setShopDescription('');
        setShopImage('');
        showToast(editingShop ? 'Product updated successfully!' : 'Product added successfully!', 'success');
      } else {
        const contentType = res.headers.get('content-type');
        let errorMessage = 'Failed to save product';
        
        if (contentType && contentType.includes('application/json')) {
          try {
        const errorData = await res.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (e) {
            // If JSON parsing fails, use default message
          }
        } else {
          try {
            const errorText = await res.text();
            if (errorText) errorMessage = errorText;
          } catch (e) {
            // If text parsing fails, use default message
          }
        }
        
        showToast(`Error: ${errorMessage}`, 'error');
        // Shop save error
      }
    } catch (error: any) {
      // Error saving shop
      showToast(`Error saving product: ${error.message || 'Please try again'}`, 'error');
    }
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentName || !paymentType) {
      showToast('Please fill in all required fields (Name, Type)', 'warning');
      return;
    }
    try {
      const data = {
        name: paymentName.trim(),
        type: paymentType.trim(),
        accountName: paymentAccountName.trim(),
        accountNumber: paymentAccountNumber.trim(),
        provider: paymentProvider.trim(),
        instructions: paymentInstructions.trim(),
        isActive: paymentIsActive
      };
      const url = editingPayment ? `/api/payment/${editingPayment}` : '/api/payment';
      const method = editingPayment ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchAllData();
        setShowPaymentForm(false);
        setEditingPayment(null);
        setPaymentName('');
        setPaymentType('');
        setPaymentAccountName('');
        setPaymentAccountNumber('');
        setPaymentProvider('');
        setPaymentInstructions('');
        setPaymentIsActive(true);
        showToast(editingPayment ? 'Payment method updated successfully!' : 'Payment method added successfully!', 'success');
      } else {
        const errorData = await res.json();
        showToast(`Error: ${errorData.error || 'Failed to save payment method'}`, 'error');
      }
    } catch (error: any) {
      showToast(`Error saving payment method: ${error.message || 'Please try again'}`, 'error');
    }
  };

  const deletePayment = async (id: string) => {
    if (!id) {
      showToast('Invalid payment method ID', 'error');
      return;
    }
    showDeleteConfirmation(
      'Are you sure you want to delete this payment method? This action cannot be undone.',
      async () => {
        try {
          const res = await fetch(`/api/payment/${id}`, { method: 'DELETE' });
          if (res.ok) {
            await fetchAllData();
            showToast('Payment method deleted successfully!', 'success');
          } else {
            const errorData = await res.json();
            showToast(`Error: ${errorData.error || 'Failed to delete payment method'}`, 'error');
          }
        } catch (error: any) {
          showToast(`Error deleting payment method: ${error.message || 'Please try again'}`, 'error');
        }
      }
    );
  };

  const deleteShop = async (id: string) => {
    if (!id) {
      showToast('Invalid product ID', 'error');
      return;
    }
    
    
    showDeleteConfirmation(
      'Are you sure you want to delete this product? This action cannot be undone.',
      async () => {
        try {
      const res = await fetch(`/api/shop/${id}`, { method: 'DELETE' });
          
          console.log('Delete shop - Response status:', res.status, res.statusText);
          
      if (res.ok) {
        await fetchAllData();
            showToast('Product deleted successfully', 'success');
          } else {
        const contentType = res.headers.get('content-type');
        let errorMessage = 'Failed to delete product';
        let errorDetails: any = null;
        
        if (contentType && contentType.includes('application/json')) {
          try {
            errorDetails = await res.json();
            errorMessage = errorDetails.error || errorDetails.message || errorMessage;
          } catch (e) {
            // Error parsing JSON error response
          }
        } else {
          try {
            const errorText = await res.text();
            if (errorText) errorMessage = errorText;
          } catch (e) {
            // Error parsing text error response
          }
        }
        
        showToast(`Error deleting product: ${errorMessage}`, 'error');
      }
    } catch (error: any) {
      // Error deleting shop
      showToast(`Error deleting product: ${error.message || 'Please try again'}`, 'error');
    }
      }
    );
  };

  const handleSaveAcademic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!academicTitle || !academicAuthor || !academicYear || !academicDescription) {
      showToast('Please fill in all required fields (Title, Author, Year, Description)', 'warning');
      return;
    }
    // Either link or PDF is required
    if (!academicLink && !pdfLink && !pdfFile) {
      showToast('Please provide either a publication link or a PDF document', 'warning');
      return;
    }
    try {
      let finalPdfLink = pdfLink?.trim() || '';
      
      // If we have a file but the link hasn't been set yet (upload might have failed), try uploading
      if (pdfFile && !finalPdfLink) {
        // Uploading PDF to Cloudinary
        try {
        const { uploadToCloudinary } = await import('@/lib/cloudinary');
        finalPdfLink = await uploadToCloudinary(pdfFile, 'nk3d/pdfs');
          // PDF uploaded successfully
          // Update the pdfLink state so it shows in the form
          setPdfLink(finalPdfLink);
        } catch (uploadError) {
          // Failed to upload PDF to Cloudinary
          showToast('Failed to upload PDF file. Please try again or provide a PDF link instead.', 'error');
          return;
        }
      }
      
      // Only validate PDF if no link is provided
      if (!academicLink && (!finalPdfLink || finalPdfLink.trim() === '')) {
        showToast('Please provide either a publication link or a PDF document', 'warning');
        return;
      }
      
      const data = {
        title: academicTitle.trim(),
        author: academicAuthor.trim(),
        year: academicYear.trim(),
        description: academicDescription.trim(),
        pdfLink: finalPdfLink || '',
        link: academicLink.trim() || ''
      };
      
      
      const url = editingAcademy ? `/api/academic/${editingAcademy}` : '/api/academic';
      const method = editingAcademy ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        await fetchAllData();
        setShowAcademyForm(false);
        setEditingAcademy(null);
        // Reset form
        setAcademicTitle('');
        setAcademicAuthor('');
        setAcademicYear('');
        setAcademicDescription('');
        setPdfLink('');
        setAcademicLink('');
        setPdfFile(null);
      } else {
        // Try to get error message from response
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
            errorMessage = errorData.error || errorData.message || errorData.msg || errorMessage;
          } else {
            const errorText = await res.text();
            errorMessage = errorText || errorMessage;
          }
        } catch (parseError) {
          // Error parsing academic save error response
        }
        showToast(`Error: ${errorMessage}`, 'error');
      }
    } catch (error) {
      // Error saving academic
      showToast('Error saving publication. Please try again.', 'error');
    }
  };

  const deleteAcademic = async (id: string) => {
    if (!id) {
      showToast('Invalid publication ID', 'error');
      return;
    }
    
    showDeleteConfirmation(
      'Are you sure you want to delete this publication? This action cannot be undone.',
      async () => {
    try {
      const res = await fetch(`/api/academic/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchAllData();
            showToast('Publication deleted successfully!', 'success');
          } else {
            const contentType = res.headers.get('content-type');
            let errorMessage = 'Failed to delete publication';
            
            if (contentType && contentType.includes('application/json')) {
              try {
                const errorData = await res.json();
                errorMessage = errorData.error || errorData.message || errorMessage;
              } catch (e) {
                // Error parsing JSON error response
              }
            } else {
              try {
                const errorText = await res.text();
                if (errorText) errorMessage = errorText;
              } catch (e) {
                // Error parsing text error response
              }
            }
            
            showToast(`Error: ${errorMessage}`, 'error');
          }
        } catch (error: any) {
      // Error deleting academic
          showToast(`Error deleting publication: ${error.message || 'Please try again'}`, 'error');
        }
      }
    );
  };


  const saveSocialLinks = async () => {
    try {
      const res = await fetch('/api/social', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...socialLinks,
          companyProfilePdf: companyProfilePdf
        }),
      });
      if (res.ok) {
        setShowSocialNotification(true);
        setTimeout(() => setShowSocialNotification(false), 3000);
        showToast('Social media links saved successfully!', 'success');
      } else {
        showToast('Failed to save social media links', 'error');
      }
    } catch (error) {
      // Error saving social links
      showToast('Error saving social media links', 'error');
    }
  };

  const handleCompanyProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showToast('Please upload a PDF file', 'error');
        return;
      }
      
      setCompanyProfilePdfFile(file);
      
      try {
        const { uploadToCloudinary } = await import('@/lib/cloudinary');
        const cloudinaryUrl = await uploadToCloudinary(file, 'nk3d/pdfs');
        setCompanyProfilePdf(cloudinaryUrl);
        showToast('Company profile PDF uploaded successfully!', 'success');
      } catch (error) {
        // Failed to upload company profile PDF
        showToast('Failed to upload PDF. Please try again.', 'error');
      }
    }
  };

  const saveCompanyProfile = async () => {
    if (!companyProfilePdf && !companyProfilePdfFile) {
      showToast('Please upload a company profile PDF first', 'warning');
      return;
    }
    
    // If a new file is selected, upload it first
    let pdfUrl = companyProfilePdf;
    if (companyProfilePdfFile) {
      try {
        const formData = new FormData();
        formData.append('file', companyProfilePdfFile);
        formData.append('upload_preset', 'nk3d_pdfs');
        formData.append('folder', 'nk3d/pdfs');

        const uploadRes = await fetch('https://api.cloudinary.com/v1_1/dgmexpa8v/raw/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload PDF to Cloudinary');
        }

        const uploadData = await uploadRes.json();
        pdfUrl = uploadData.secure_url;
        setCompanyProfilePdf(pdfUrl);
      } catch (error) {
        // Error uploading PDF
        showToast('Failed to upload PDF', 'error');
        return;
      }
    }
    
    try {
      const res = await fetch('/api/social', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...socialLinks,
          companyProfilePdf: pdfUrl
        }),
      });
      if (res.ok) {
        showToast(companyProfilePdfFile ? 'Company profile PDF updated successfully!' : 'Company profile PDF saved successfully!', 'success');
        setCompanyProfilePdfFile(null);
      } else {
        showToast('Failed to save company profile PDF', 'error');
      }
    } catch (error) {
      console.error('Error saving company profile:', error);
      showToast('Error saving company profile PDF', 'error');
    }
  };

  const deleteCompanyProfile = async () => {
    if (!companyProfilePdf) {
      showToast('No PDF to delete', 'warning');
      return;
    }
    
    showDeleteConfirmation(
      'Are you sure you want to delete the company profile PDF? This action cannot be undone.',
      async () => {
        try {
          const res = await fetch('/api/social', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...socialLinks,
              companyProfilePdf: ''
            }),
          });
          if (res.ok) {
            setCompanyProfilePdf('');
            setCompanyProfilePdfFile(null);
            showToast('Company profile PDF deleted successfully!', 'success');
          } else {
            showToast('Failed to delete company profile PDF', 'error');
          }
        } catch (error) {
          console.error('Error deleting company profile:', error);
          showToast('Error deleting company profile PDF', 'error');
        }
      }
    );
  };

  const savePartner = async (logo: string) => {
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logo }),
      });
      if (res.ok) {
        await fetchAllData();
        setNewPartnerLogo('');
      }
    } catch (error) {
      console.error('Error saving partner:', error);
    }
  };

  const deletePartner = async (id: string) => {
    if (!id) {
      showToast('Invalid partner ID', 'error');
      return;
    }
    
    showDeleteConfirmation(
      'Are you sure you want to delete this partner logo? This action cannot be undone.',
      async () => {
    try {
      const res = await fetch(`/api/partners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchAllData();
            showToast('Partner logo deleted successfully!', 'success');
          } else {
            const contentType = res.headers.get('content-type');
            let errorMessage = 'Failed to delete partner logo';
            
            if (contentType && contentType.includes('application/json')) {
              try {
                const errorData = await res.json();
                errorMessage = errorData.error || errorData.message || errorMessage;
              } catch (e) {
                console.error('Error parsing JSON error response:', e);
              }
            }
            
            showToast(`Error: ${errorMessage}`, 'error');
          }
        } catch (error: any) {
      console.error('Error deleting partner:', error);
          showToast(`Error deleting partner logo: ${error.message || 'Please try again'}`, 'error');
    }
      }
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setImage: (url: string) => void, folder: string = 'nk3d/images') => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local preview first
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      try {
        const { uploadToCloudinary } = await import('@/lib/cloudinary');
        const cloudinaryUrl = await uploadToCloudinary(file, folder);
        setImage(cloudinaryUrl);
      } catch (error) {
        // Failed to upload to Cloudinary
        // Keep the local preview if upload fails
      }
    }
  };

  // Handle multiple image uploads for gallery
  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, folder: string = 'nk3d/images') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    showToast(`Uploading ${fileArray.length} image(s)...`, 'info');

    try {
      const { uploadToCloudinary } = await import('@/lib/cloudinary');
      const uploadPromises = fileArray.map(async (file) => {
        try {
          const cloudinaryUrl = await uploadToCloudinary(file, folder);
          return cloudinaryUrl;
        } catch (error) {
          console.error('Failed to upload image:', error);
          return null;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url): url is string => url !== null);
      
      if (validUrls.length > 0) {
        setPortfolioGallery([...portfolioGallery, ...validUrls]);
        showToast(`Successfully uploaded ${validUrls.length} image(s)!`, 'success');
      } else {
        showToast('Failed to upload images. Please try again.', 'error');
      }

      // Reset file input
      e.target.value = '';
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      showToast('Error uploading images. Please try again.', 'error');
    }
  };

  // Reusable Image Upload Component
  const ImageUploadField = ({ 
    label, 
    imageUrl, 
    onImageChange, 
    preview = true,
    folder = 'nk3d/images'
  }: { 
    label: string; 
    imageUrl: string; 
    onImageChange: (url: string) => void;
    preview?: boolean;
    folder?: string;
  }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleClick}
            className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#009f3b] hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Upload className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">Upload Image</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, onImageChange, folder)}
            className="hidden"
          />
          {imageUrl && preview && (
            <div className="relative">
              <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded border" />
              <button
                type="button"
                onClick={() => onImageChange('')}
                className="absolute -top-2 -right-2 bg-[#00782d] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-[#009f3b]"
              >
                ×
              </button>
            </div>
          )}
        </div>
        {imageUrl && preview && (
          <div className="mt-2">
            <img src={imageUrl} alt="Preview" className="max-w-xs h-32 object-cover rounded border" />
          </div>
        )}
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#009f3b] mb-2">Admin Login</h1>
            <p className="text-gray-600">NK 3D Architecture Studio</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent text-black placeholder:text-black"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent text-black placeholder:text-black"
              />
            </div>
            <p className="text-xs text-gray-500 text-center">Username: <strong>admin</strong> | Password: <strong>admin</strong></p>
            <button
              type="submit"
              className="w-full bg-[#009f3b] text-white px-6 py-3 rounded-none font-semibold hover:bg-[#00782d] transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  const tabs = [
    { id: 'portfolio' as ActiveTab, label: 'Portfolio', icon: FolderOpen },
    { id: 'team' as ActiveTab, label: 'Team', icon: Users },
    { id: 'shop' as ActiveTab, label: 'Shop', icon: ShoppingCart },
    { id: 'academy' as ActiveTab, label: 'Academic', icon: GraduationCap },
    { id: 'orders' as ActiveTab, label: 'Orders', icon: Package },
    { id: 'inquiries' as ActiveTab, label: 'Inquiries', icon: Mail },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex relative">
        {/* Sidebar - Primary Green */}
        <aside className={`fixed left-0 top-0 ${isSidebarMinimized ? 'lg:w-20 w-64' : 'w-64'} ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} bg-[#009f3b] shadow-lg h-screen overflow-y-auto flex flex-col transition-all duration-300 z-50`}>
          {/* User Profile Section with Toggle Button */}
          <div className={`p-4 md:p-6 ${isSidebarMinimized ? 'px-4' : ''}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`${isSidebarMinimized ? 'w-12 h-12' : 'w-16 h-16'} bg-white rounded-full flex items-center justify-center flex-shrink-0 transition-all`}>
                  <User className={`${isSidebarMinimized ? 'w-6 h-6' : 'w-8 h-8'} text-[#009f3b]`} />
                </div>
                {!isSidebarMinimized && (
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-base md:text-lg mb-0.5 truncate">Admin User</h3>
                    <p className="text-white/80 text-xs md:text-sm truncate">admin@nk3dstudio.rw</p>
                  </div>
                )}
              </div>
            <button
              onClick={() => {
                setIsSidebarMinimized(!isSidebarMinimized);
                setIsMobileSidebarOpen(false);
              }}
                className="flex items-center justify-center p-1.5 md:p-2 text-white hover:bg-[#00782d] rounded transition-colors flex-shrink-0"
              title={isSidebarMinimized ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {isSidebarMinimized ? (
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                )}
            </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className={`p-4 space-y-2 flex-1 ${isSidebarMinimized ? 'px-2' : ''}`}>
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full ${isSidebarMinimized ? 'justify-center px-2' : 'text-left px-4'} py-3 transition-colors flex items-center gap-3 ${
                activeTab === 'dashboard'
                  ? 'bg-white text-[#009f3b]'
                  : 'text-white hover:bg-[#00782d]'
              }`}
              title={isSidebarMinimized ? 'Dashboard' : ''}
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              {!isSidebarMinimized && <span className="font-medium">Dashboard</span>}
            </button>
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full ${isSidebarMinimized ? 'justify-center px-2' : 'text-left px-4'} py-3 transition-colors flex items-center gap-3 ${
                    activeTab === tab.id
                      ? 'bg-white text-[#009f3b]'
                      : 'text-white hover:bg-[#00782d]'
                  }`}
                  title={isSidebarMinimized ? tab.label : ''}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {!isSidebarMinimized && <span className="font-medium">{tab.label}</span>}
                </button>
              );
            })}
          </nav>
          
          {/* Logout Button */}
          <div className={`p-4 ${isSidebarMinimized ? 'px-2' : ''}`}>
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setUsername('');
                setPassword('');
              }}
              className={`w-full ${isSidebarMinimized ? 'justify-center px-2' : 'text-left px-4'} py-3 transition-colors flex items-center gap-3 text-white hover:bg-[#00782d] font-medium`}
              title={isSidebarMinimized ? 'Logout' : ''}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isSidebarMinimized && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className={`flex-1 p-4 md:p-6 transition-all duration-300 ${isSidebarMinimized ? 'lg:ml-20' : 'lg:ml-64'} ml-0`}>
          {/* Header */}
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-200"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard User</h1>
            </div>
          </div>

          {/* Summary Cards - Only show on dashboard tab */}
          {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="bg-[#009f3b] text-white p-4 md:p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-xs md:text-sm mb-1">Portfolio</p>
                  <p className="text-xl md:text-2xl font-bold">{portfolios.length}</p>
                </div>
                <FolderOpen className="w-6 h-6 md:w-8 md:h-8 text-white/80 flex-shrink-0" />
                </div>
                </div>
            <div className="bg-[#009f3b] text-white p-4 md:p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-xs md:text-sm mb-1">Team Members</p>
                  <p className="text-xl md:text-2xl font-bold">{teams.length}</p>
                </div>
                <Users className="w-6 h-6 md:w-8 md:h-8 text-white/80 flex-shrink-0" />
                    </div>
                    </div>
            <div className="bg-[#009f3b] text-white p-4 md:p-6 rounded-lg">
              <div className="flex items-center justify-between">
                    <div>
                  <p className="text-white/80 text-xs md:text-sm mb-1">Products</p>
                  <p className="text-xl md:text-2xl font-bold">{products.length}</p>
                    </div>
                <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 text-white/80 flex-shrink-0" />
                    </div>
                  </div>
            <div className="bg-[#009f3b] text-white p-4 md:p-6 rounded-lg">
              <div className="flex items-center justify-between">
                    <div>
                  <p className="text-white/80 text-xs md:text-sm mb-1">Publications</p>
                  <p className="text-xl md:text-2xl font-bold">{publications.length}</p>
                    </div>
                <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-white/80 flex-shrink-0" />
                    </div>
                    </div>
                    </div>
          )}

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Social Media Links Management */}
              <div className="bg-white p-4 md:p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#009f3b]">Social Media Links</h3>
                  {showSocialNotification && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Links saved!
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook URL</label>
                      <input
                        type="url"
                        value={socialLinks.facebook}
                        onChange={(e) => setSocialLinks({...socialLinks, facebook: e.target.value})}
                        placeholder="https://facebook.com/yourpage"
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter/X URL</label>
                      <input
                        type="url"
                        value={socialLinks.twitter}
                        onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
                        placeholder="https://twitter.com/yourhandle"
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn URL</label>
                      <input
                        type="url"
                        value={socialLinks.linkedin}
                        onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                        placeholder="https://linkedin.com/company/yourcompany"
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram URL</label>
                      <input
                        type="url"
                        value={socialLinks.instagram}
                        onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})}
                        placeholder="https://instagram.com/yourhandle"
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black"
                      />
                    </div>
                  </div>
                  <button
                    onClick={saveSocialLinks}
                    className="bg-[#009f3b] text-white px-6 py-2 rounded-none font-semibold hover:bg-[#00782d] transition-colors"
                  >
                    Save Social Links
                  </button>
                </div>
              </div>

              {/* Company Profile PDF Management */}
              <div className="bg-white p-4 md:p-6 rounded-lg">
                <h3 className="text-lg font-bold text-[#009f3b] mb-4">Company Profile PDF</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {companyProfilePdf ? 'Update Company Profile PDF' : 'Upload Company Profile PDF'}
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleCompanyProfileUpload}
                          className="hidden"
                        />
                        <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 hover:border-[#009f3b] transition-colors rounded-lg">
                          <FileText className="w-5 h-5 text-gray-600" />
                          <span className="text-sm text-gray-700">
                            {companyProfilePdfFile ? companyProfilePdfFile.name : companyProfilePdf ? 'Choose new PDF file' : 'Choose PDF file'}
                          </span>
                        </div>
                      </label>
                      {(companyProfilePdfFile || companyProfilePdf) && (
                        <button
                          onClick={saveCompanyProfile}
                          className="bg-[#009f3b] text-white px-6 py-3 rounded-none font-semibold hover:bg-[#00782d] transition-colors flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          {companyProfilePdfFile ? 'Update PDF' : 'Save PDF'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {companyProfilePdf && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-[#009f3b]" />
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Current Company Profile</p>
                            <p className="text-xs text-gray-500 truncate max-w-md">{companyProfilePdf}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={companyProfilePdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors flex items-center gap-2 text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </a>
                          <a
                            href={companyProfilePdf}
                            download
                            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Download
                          </a>
                          <button
                            onClick={deleteCompanyProfile}
                            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                          >
                            <X className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Partners Logos Management */}
              <div className="bg-white p-4 md:p-6 rounded-lg">
                <h3 className="text-lg font-bold text-[#009f3b] mb-4">Partner Logos</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <ImageUploadField
                        label="Add Partner Logo"
                        imageUrl={newPartnerLogo}
                        onImageChange={setNewPartnerLogo}
                        folder="nk3d/partners"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          if (newPartnerLogo) {
                            savePartner(newPartnerLogo);
                          }
                        }}
                        className="w-full bg-[#009f3b] text-white px-4 py-2 rounded-none font-semibold hover:bg-[#00782d] transition-colors"
                      >
                        Add Partner Logo
                      </button>
                    </div>
                  </div>
                  
                  {partnerLogos.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Current Partner Logos ({partnerLogos.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {partnerLogos.map((partner: any) => (
                          <div key={partner._id || partner.id} className="relative border border-gray-200 p-3">
                            <img src={partner.logo} alt={`Partner ${partner._id || partner.id}`} className="w-full h-20 object-contain" />
                            <button
                              onClick={() => {
                                const partnerId = partner._id || partner.id;
                                if (partnerId) {
                                  deletePartner(String(partnerId));
                                } else {
                                  showToast('Error: Invalid partner ID', 'error');
                                }
                              }}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Portfolio Management */}
          {activeTab === 'portfolio' && (
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#009f3b]">Portfolio Management</h2>
                <div className="flex gap-3">
                  {/* View Toggle */}
                  <div className="flex border border-gray-300">
                    <button
                      onClick={() => setPortfolioView('grid')}
                      className={`p-2 ${portfolioView === 'grid' ? 'bg-[#009f3b] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Grid3x3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setPortfolioView('list')}
                      className={`p-2 ${portfolioView === 'list' ? 'bg-[#009f3b] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                </div>
                <button
                    onClick={() => {
                      setEditingPortfolio(null);
                      setPortfolioTitle('');
                      setPortfolioCategory('');
      setIsNewCategory(false);
      setNewCategoryName('');
                      setPortfolioYear('');
                      setPortfolioDescription('');
                      setPortfolioArea('');
                      setPortfolioClient('');
                      setPortfolioStatus('');
                      setPortfolioLocation('');
                      setPortfolioKeyFeatures([]);
      setNewKeyFeature('');
                      setPortfolioImage('');
                      setPortfolioGallery([]);
                      setShowPortfolioForm(true);
                    }}
                    className="bg-[#009f3b] text-white px-4 py-2 rounded-none font-semibold hover:bg-[#00782d] transition-colors"
                  >
                    + Create New Portfolio
                </button>
              </div>
            </div>

              {/* Portfolio List/Grid */}
              {!showPortfolioForm && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Portfolio Projects ({portfolios.length})</h3>
                  
                  {/* Grid View */}
                  {portfolioView === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {portfolios.map((portfolio) => (
                        <div key={portfolio._id || portfolio.id} className="border border-gray-200 overflow-hidden transition-shadow">
                          <div className="relative h-48 bg-gray-100">
                            <Image
                              src={portfolio.image}
                              alt={portfolio.title}
                              fill
                              className="object-cover"
                  />
                </div>
                          <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-900 mb-2">{portfolio.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {portfolio.category} • {portfolio.year} • {portfolio.location}
                            </p>
                            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{portfolio.description}</p>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => {
                                  const portfolioId = portfolio._id || portfolio.id;
                                  window.open(`/portfolio/${portfolioId}`, '_blank');
                                }}
                                className="flex-1 px-3 py-2 bg-[#009f3b] text-white text-sm hover:bg-[#00782d] transition-colors flex items-center justify-center gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                              <button 
                                onClick={() => {
                                  setShowPortfolioForm(true);
                                  setEditingPortfolio(portfolio._id || portfolio.id);
                                }}
                                className="px-3 py-2 bg-[#009f3b] text-white text-sm hover:bg-[#00782d] transition-colors"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => {
                                  const portfolioId = portfolio._id || portfolio.id;
                                  showDeleteConfirmation(
                                    `Are you sure you want to delete "${portfolio.title}"? This action cannot be undone.`,
                                    () => deletePortfolio(String(portfolioId))
                                  );
                                }}
                                className="px-3 py-2 bg-[#00782d] text-white text-sm hover:bg-[#009f3b] transition-colors"
                              >
                                Delete
                              </button>
                </div>
                </div>
                    </div>
                      ))}
                    </div>
                  )}

                  {/* List View */}
                  {portfolioView === 'list' && (
                  <div className="space-y-4">
                      {portfolios.map((portfolio) => (
                        <div key={portfolio.id} className="border border-gray-200 transition-shadow overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="relative w-full md:w-48 h-48 md:h-auto bg-gray-100 flex-shrink-0">
                              <Image
                                src={portfolio.image}
                                alt={portfolio.title}
                                fill
                                className="object-cover"
                  />
                </div>
                            <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{portfolio.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                  Category: {portfolio.category} | Year: {portfolio.year} | Location: {portfolio.location}
                                </p>
                                <p className="text-sm text-gray-700">{portfolio.description}</p>
                </div>
                              <div className="flex gap-2 mt-4">
                                <button 
                                  onClick={() => {
                                    const portfolioId = portfolio._id || portfolio.id;
                                    window.open(`/portfolio/${portfolioId}`, '_blank');
                                  }}
                                  className="px-3 py-1 bg-[#009f3b] text-white text-sm hover:bg-[#00782d] transition-colors flex items-center gap-1"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                <button
                                  onClick={() => {
                                    setShowPortfolioForm(true);
                                    setEditingPortfolio(portfolio._id || portfolio.id);
                                  }}
                                  className="px-3 py-1 bg-[#009f3b] text-white text-sm hover:bg-[#00782d] transition-colors"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => {
                                    const portfolioId = portfolio._id || portfolio.id;
                                    showDeleteConfirmation(
                                      `Are you sure you want to delete "${portfolio.title}"? This action cannot be undone.`,
                                      () => deletePortfolio(String(portfolioId))
                                    );
                                  }}
                                  className="px-3 py-1 bg-[#00782d] text-white text-sm hover:bg-[#009f3b] transition-colors"
                                >
                                  Delete
                </button>
              </div>
            </div>
                </div>
                </div>
                      ))}
                </div>
                  )}
            </div>
          )}

              {/* Add/Edit Form */}
              {showPortfolioForm && (
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#009f3b]">
                      {editingPortfolio ? 'Edit Project' : 'Create New Project'}
                    </h3>
                <button
                      onClick={() => {
                        setShowPortfolioForm(false);
                        setEditingPortfolio(null);
                      }}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Cancel
                </button>
              </div>
                <form onSubmit={handleSavePortfolio} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title *</label>
                      <input 
                        type="text" 
                        value={portfolioTitle}
                        onChange={(e) => setPortfolioTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black" 
                        required
                      />
                    </div>
                    <div>
                      <ImageUploadField
                        label="Project Image"
                        imageUrl={portfolioImage}
                        onImageChange={setPortfolioImage}
                      />
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Project Gallery (Additional Images)</h4>
                    <div className="space-y-4">
                      {/* Multiple Image Upload */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Add Multiple Images
                        </label>
                        <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => {
                              const fileInput = document.getElementById('gallery-multi-upload') as HTMLInputElement;
                              fileInput?.click();
                          }}
                            className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#009f3b] hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <Upload className="w-5 h-5 text-gray-600" />
                            <span className="text-sm text-gray-600">Select Multiple Images</span>
                        </button>
                          <input
                            id="gallery-multi-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleMultipleImageUpload(e, 'nk3d/images')}
                            className="hidden"
                          />
                          <p className="text-xs text-gray-500">
                            You can select multiple images at once
                          </p>
                      </div>
                      </div>
                      
                      {/* Gallery Preview */}
                      {portfolioGallery.length > 0 && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Gallery Images ({portfolioGallery.length})
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {portfolioGallery.map((img, index) => (
                              <div key={index} className="relative group">
                                <div className="relative aspect-[4/3] bg-gray-100 rounded overflow-hidden border border-gray-200">
                                  <Image
                                    src={img}
                                    alt={`Gallery ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPortfolioGallery(portfolioGallery.filter((_, i) => i !== index));
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-lg"
                                    title="Remove image"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Image {index + 1}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              showDeleteConfirmation(
                                `Are you sure you want to remove all ${portfolioGallery.length} gallery images?`,
                                () => setPortfolioGallery([])
                              );
                            }}
                            className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
                          >
                            Clear All Gallery Images
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                      <div className="space-y-2">
                        <select
                          value={isNewCategory ? 'new' : portfolioCategory}
                          onChange={(e) => {
                            if (e.target.value === 'new') {
                              setIsNewCategory(true);
                              setPortfolioCategory('');
                              setNewCategoryName('');
                            } else {
                              setIsNewCategory(false);
                              setPortfolioCategory(e.target.value);
                              setNewCategoryName('');
                            }
                          }}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black"
                          required={!isNewCategory}
                        >
                          <option value="">Select a category</option>
                          {availableCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                          <option value="new">+ Create New Category</option>
                        </select>
                        {isNewCategory && (
                        <input 
                          type="text" 
                            placeholder="Enter new category name"
                            value={newCategoryName}
                            onChange={(e) => {
                              setNewCategoryName(e.target.value);
                              setPortfolioCategory(e.target.value);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black"
                          required
                        />
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Year *</label>
                        <input 
                          type="text" 
                          placeholder="e.g., 2024" 
                          value={portfolioYear}
                          onChange={(e) => setPortfolioYear(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black"
                          required
                        />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                      <textarea 
                        rows={3} 
                        value={portfolioDescription}
                        onChange={(e) => setPortfolioDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black"
                        required
                      />
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Project Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Area</label>
                        <input 
                          type="text" 
                          placeholder="e.g., 15,000 sqm" 
                          value={portfolioArea}
                          onChange={(e) => setPortfolioArea(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Client</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Private Developer" 
                          value={portfolioClient}
                          onChange={(e) => setPortfolioClient(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                        <select 
                          value={portfolioStatus}
                          onChange={(e) => setPortfolioStatus(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black"
                        >
                          <option value="">Select Status</option>
                          <option value="Completed">Completed</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Pending">Pending</option>
                          <option value="Under Construction">Under Construction</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Kigali, Rwanda" 
                          value={portfolioLocation}
                          onChange={(e) => setPortfolioLocation(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black" 
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Key Features</label>
                    <div className="space-y-3">
                      {/* Add New Feature */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter a key feature"
                          value={newKeyFeature}
                          onChange={(e) => setNewKeyFeature(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (newKeyFeature.trim()) {
                                setPortfolioKeyFeatures([...portfolioKeyFeatures, newKeyFeature.trim()]);
                                setNewKeyFeature('');
                              }
                            }
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black"
                    />
                        <button
                          type="button"
                          onClick={() => {
                            if (newKeyFeature.trim()) {
                              setPortfolioKeyFeatures([...portfolioKeyFeatures, newKeyFeature.trim()]);
                              setNewKeyFeature('');
                            }
                          }}
                          className="bg-[#009f3b] text-white px-4 py-2 rounded-none font-semibold hover:bg-[#00782d] transition-colors whitespace-nowrap"
                        >
                          Add Feature
                        </button>
                      </div>
                      
                      {/* Features List */}
                      {portfolioKeyFeatures.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500">
                            {portfolioKeyFeatures.length} feature{portfolioKeyFeatures.length !== 1 ? 's' : ''} added
                          </p>
                          <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                            {portfolioKeyFeatures.map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors group"
                              >
                                <span className="flex-1 text-sm text-gray-700">{feature}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPortfolioKeyFeatures(portfolioKeyFeatures.filter((_, i) => i !== index));
                                  }}
                                  className="text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Remove feature"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          {portfolioKeyFeatures.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Are you sure you want to remove all ${portfolioKeyFeatures.length} key features?`)) {
                                  setPortfolioKeyFeatures([]);
                                }
                              }}
                              className="text-sm text-red-600 hover:text-red-700 underline"
                            >
                              Clear All Features
                            </button>
                          )}
                        </div>
                      )}
                      {portfolioKeyFeatures.length === 0 && (
                        <p className="text-xs text-gray-500">No key features added yet. Add features above.</p>
                      )}
                    </div>
                  </div>
                    <div className="flex gap-3">
                      <button 
                        type="submit"
                        className="bg-[#009f3b] text-white px-6 py-2 rounded-none font-semibold hover:bg-[#00782d] transition-colors"
                      >
                        {editingPortfolio ? 'Update Project' : 'Create Project'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setShowPortfolioForm(false);
                          setEditingPortfolio(null);
                        }}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-none font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                  </button>
                </div>
                </form>
              </div>
              )}
          </div>
          )}

          {/* Academy/Research Management */}
          {activeTab === 'academy' && (
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#009f3b]">Research Publications Management</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setShowAcademyForm(true);
                      setEditingAcademy(null);
                      setAcademicTitle('');
                      setAcademicAuthor('');
                      setAcademicYear('');
                      setAcademicDescription('');
                      setPdfLink('');
                      setAcademicLink('');
                      setPdfFile(null);
                    }}
                    className="bg-[#009f3b] text-white px-4 py-2 rounded-none font-semibold hover:bg-[#00782d] transition-colors"
                  >
                    + Publish New Research
                  </button>
                  </div>
                </div>

              {/* Publications List/Grid */}
              {!showAcademyForm && (
                    <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Research Publications ({publications.length})</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {publications.map((publication) => (
                        <div key={publication._id || publication.id} className="border border-gray-200 rounded-lg overflow-hidden transition-shadow">
                          <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-900 mb-2">{publication.title}</h3>
                            <p className="text-sm text-gray-600 mb-1">Author: {publication.author}</p>
                            <p className="text-xs text-gray-500 mb-3">Year: {publication.year}</p>
                            <p className="text-sm text-gray-700 mb-4 line-clamp-3">{publication.description}</p>
                            {publication.link && publication.link.trim() ? (
                              <a
                                href={publication.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mb-3 inline-flex items-center gap-2 px-3 py-2 bg-[#009f3b] text-white text-sm hover:bg-[#00782d] transition-colors"
                              >
                                <FileText className="w-4 h-4" />
                                View Link
                              </a>
                            ) : publication.pdfLink ? (
                              <button
                                onClick={() => {
                                  const publicationId = publication._id || publication.id;
                                  setCurrentPdfUrl(`/api/academic/pdf/${publicationId}`);
                                  setShowPdfViewer(true);
                                }}
                                className="mb-3 inline-flex items-center gap-2 px-3 py-2 bg-[#009f3b] text-white text-sm hover:bg-[#00782d] transition-colors"
                              >
                                <FileText className="w-4 h-4" />
                                View PDF
                              </button>
                            ) : null}
                    <div className="flex gap-2">
                              <button 
                                onClick={() => {
                                  setShowAcademyForm(true);
                                  setEditingAcademy(publication._id || publication.id);
                                  setAcademicTitle(publication.title || '');
                                  setAcademicAuthor(publication.author || '');
                                  setAcademicYear(publication.year || '');
                                  setAcademicDescription(publication.description || '');
                                  setPdfLink(publication.pdfLink || '');
                                  setAcademicLink(publication.link || '');
                                  setPdfFile(null);
                                }}
                                className="flex-1 px-3 py-2 bg-[#009f3b] text-white text-sm hover:bg-[#00782d] rounded transition-colors"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => {
                                  const publicationId = publication._id || publication.id;
                                  if (publicationId) {
                                    deleteAcademic(String(publicationId));
                                  } else {
                                    showToast('Error: Invalid publication ID', 'error');
                                  }
                                }}
                                className="flex-1 px-3 py-2 bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
                              >
                                Delete
                              </button>
                    </div>
                  </div>
                </div>
                      ))}
              </div>
            </div>
          )}

              {/* Add/Edit Form */}
              {showAcademyForm && (
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#009f3b]">
                      {editingAcademy ? 'Edit Research Publication' : 'Publish New Research'}
                    </h3>
                    <button 
                      onClick={() => {
                        setShowAcademyForm(false);
                        setEditingAcademy(null);
                        setPdfLink('');
                        setAcademicLink('');
                        setPdfFile(null);
                      }}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Cancel
                </button>
              </div>
                <form onSubmit={handleSaveAcademic} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Publication Title *</label>
                      <input 
                        type="text" 
                        value={academicTitle}
                        onChange={(e) => setAcademicTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black"
                        required
                      />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Author *</label>
                        <input 
                          type="text" 
                          value={academicAuthor}
                          onChange={(e) => setAcademicAuthor(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black"
                          required
                        />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Year *</label>
                        <input 
                          type="text" 
                          value={academicYear}
                          onChange={(e) => setAcademicYear(e.target.value)}
                          placeholder="e.g., 2024"
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black"
                          required
                        />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                      <textarea 
                        rows={3} 
                        value={academicDescription}
                        onChange={(e) => setAcademicDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black"
                        required
                      />
                  </div>
                    <div className="border-t pt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Publication Link (Optional)</label>
                      <input 
                        type="url" 
                        value={academicLink}
                        onChange={(e) => setAcademicLink(e.target.value)}
                        placeholder="https://example.com/publication"
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black mb-4" 
                      />
                      <p className="text-xs text-gray-500 mb-4">If a link is provided, users will be able to follow it instead of viewing/downloading PDF</p>
                      
                      <label className="block text-sm font-semibold text-gray-700 mb-2">PDF Document (Optional)</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">PDF Link (URL)</label>
                          <input 
                            type="url" 
                            value={pdfLink}
                            onChange={(e) => setPdfLink(e.target.value)}
                            placeholder="https://example.com/publication.pdf"
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Upload PDF File</label>
                          <div className="flex items-center gap-2">
                            <label className="flex-1 cursor-pointer">
                              <input
                                type="file"
                                accept=".pdf"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setPdfFile(file);
                                    setPdfLink(''); // Clear link if file is selected
                                    
                                    // Upload PDF to Cloudinary
                                    try {
                                      const { uploadToCloudinary } = await import('@/lib/cloudinary');
                                      const cloudinaryUrl = await uploadToCloudinary(file, 'nk3d/pdfs');
                                      setPdfLink(cloudinaryUrl);
                                    } catch (error) {
                                      // Failed to upload PDF to Cloudinary
                                    }
                                  }
                                }}
                                className="hidden"
                              />
                              <div className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors">
                                <Upload className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-700">
                                  {pdfFile ? pdfFile.name : 'Choose PDF file'}
                                </span>
                              </div>
                            </label>
                            {pdfFile && (
                              <button
                                onClick={() => {
                                  setPdfFile(null);
                                  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                                  if (fileInput) fileInput.value = '';
                                }}
                                className="px-3 py-2 text-sm text-[#00782d] hover:text-[#009f3b]"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          {pdfFile && (
                            <p className="text-xs text-gray-500 mt-1">
                              Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        type="submit"
                        className="bg-[#009f3b] text-white px-6 py-2 rounded-none font-semibold hover:bg-[#00782d] transition-colors"
                      >
                        {editingAcademy ? 'Update Publication' : 'Publish Research'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setShowAcademyForm(false);
                          setEditingAcademy(null);
                          setPdfLink('');
                          setPdfFile(null);
                        }}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-none font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                </form>
                </div>
              )}
            </div>
          )}

          {/* Team Management */}
          {activeTab === 'team' && (
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#009f3b]">Team Management</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setEditingTeam(null);
                      setTeamName('');
                      setTeamPosition('');
                      setTeamCategory([]);
                      setTeamPhone('');
                      setTeamLinkedin('');
                      setTeamDescription('');
                      setTeamExperience('');
                      setTeamEducation('');
                      setTeamCertification('');
                      setTeamImage('');
                      setCopyFromMember('');
                      setShowTeamForm(true);
                    }}
                    className="bg-[#009f3b] text-white px-3 md:px-4 py-2 text-sm md:text-base rounded-none font-semibold hover:bg-[#00782d] transition-colors"
                  >
                  + Add Team Member
                </button>
                </div>
                </div>

              {/* Team List/Grid */}
              {!showTeamForm && (
                  <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4">Team Members ({teams.length})</h3>
                  
                  {/* Group teams by category */}
                  {(() => {
                    const groupedTeams = teams.reduce((acc, member) => {
                      // Handle both array and string categories
                      const categories = Array.isArray(member.category) 
                        ? member.category 
                        : (member.category && typeof member.category === 'string' ? [member.category] : ['Uncategorized']);
                      
                      categories.forEach((cat: string) => {
                        const category = (cat && typeof cat === 'string' ? cat.trim() : 'Uncategorized') || 'Uncategorized';
                        if (!acc[category]) {
                          acc[category] = [];
                        }
                        // Only add if not already in this category (avoid duplicates)
                        if (!acc[category].some((m: any) => (m._id || m.id) === (member._id || member.id))) {
                          acc[category].push(member);
                        }
                      });
                      return acc;
                    }, {} as Record<string, typeof teams>);

                    const categories = Object.keys(groupedTeams);

                    return (
                      <div className="space-y-6 md:space-y-8">
                        {categories.map((category) => (
                          <div key={category} className="space-y-4">
                            <h4 className="text-lg md:text-xl font-bold text-[#009f3b] border-b-2 border-[#009f3b] pb-2 mb-4">
                              {category} ({groupedTeams[category].length})
                            </h4>
                            
                            {/* Mobile Card Layout */}
                            <div className="block md:hidden space-y-3">
                              {groupedTeams[category].map((member: any) => (
                                <div key={member._id || member.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                                  <div className="flex items-start gap-3">
                                    <div className="relative w-16 h-16 flex-shrink-0">
                                      <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover rounded-full"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h5 className="text-base font-semibold text-gray-900 mb-1">{member.name}</h5>
                                      <p className="text-sm text-gray-600 mb-2">{member.position}</p>
                                      {member.phone && (
                                        <p className="text-xs text-gray-600 mb-1">
                                          <span className="font-medium">Phone:</span> {member.phone}
                                        </p>
                                      )}
                                      {member.linkedin && (
                                        <a 
                                          href={member.linkedin} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-xs text-[#009f3b] hover:text-[#00782d] hover:underline block"
                                        >
                                          View LinkedIn Profile
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                                    <button
                                      onClick={() => {
                                        const id = member._id || member.id;
                                        if (!id) {
                                          showToast('Error: Team member ID is missing', 'error');
                                          // Team member missing ID
                                          return;
                                        }
                                        const teamId = String(id).trim();
                                        if (!teamId || teamId === 'undefined' || teamId === 'null') {
                                          showToast('Error: Invalid team member ID', 'error');
                                          console.error('Invalid team ID:', id, 'Stringified:', teamId);
                                          return;
                                        }
                                        setEditingTeam(teamId);
                                        setTeamName(member.name || '');
                                        setTeamPosition(member.position || '');
                                        const memberCategories = Array.isArray(member.category) 
                                          ? member.category 
                                          : (member.category ? [member.category] : []);
                                        setTeamCategory(memberCategories);
                                        setTeamPhone(member.phone || '');
                                        setTeamLinkedin(member.linkedin || '');
                                        setTeamDescription(member.description || '');
                                        setTeamExperience(member.experience || '');
                                        setTeamEducation(member.education || '');
                                        setTeamCertification(member.certification || '');
                                        setTeamImage(member.image || '');
                                        setShowTeamForm(true);
                                      }}
                                      className="flex-1 px-3 py-2 bg-[#009f3b] text-white text-xs hover:bg-[#00782d] transition-colors"
                                    >
                                      Edit
                                    </button>
                                    <button 
                                      onClick={() => {
                                        let id = member._id || member.id;
                                        if (id && typeof id === 'object') {
                                          id = id.toString ? id.toString() : String(id);
                                        } else if (id) {
                                          id = String(id);
                                        }
                                        if (!id || id === 'undefined' || id === 'null') {
                                          showToast(`Error: Team member ID is missing for ${member.name}`, 'error');
                                          // Team member missing ID for deletion
                                          return;
                                        }
                                        const teamId = id.trim();
                                        if (!teamId || teamId === 'undefined' || teamId === 'null' || teamId === '') {
                                          showToast(`Error: Invalid team member ID for ${member.name}. ID value: "${teamId}"`, 'error');
                                          // Invalid team ID for deletion
                                          return;
                                        }
                                        if (teamId.length < 5 || !/^[a-zA-Z0-9_-]+$/.test(teamId)) {
                                          showToast(`Error: Invalid team member ID format for ${member.name}. ID: "${teamId}" (length: ${teamId.length})`, 'error');
                                          // Invalid ID format for deletion
                                          return;
                                        }
                                        showDeleteConfirmation(
                                          `Are you sure you want to delete ${member.name}? This action cannot be undone.`,
                                          () => {
                                            deleteTeam(teamId);
                                          }
                                        );
                                      }}
                                      className="flex-1 px-3 py-2 bg-[#00782d] text-white text-xs hover:bg-[#009f3b] transition-colors"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Desktop Table Layout */}
                            <div className="hidden md:block overflow-x-auto">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Image</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Position</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Phone</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">LinkedIn</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {groupedTeams[category].map((member: any) => (
                                    <tr key={member._id || member.id} className="border-b border-gray-200 hover:bg-gray-50">
                                      <td className="px-4 py-3">
                                        <div className="relative w-12 h-12">
                                          <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover rounded-full"
                                          />
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{member.name}</td>
                                      <td className="px-4 py-3 text-sm text-gray-600">{member.position}</td>
                                      <td className="px-4 py-3 text-sm text-gray-600">{member.phone || '-'}</td>
                                      <td className="px-4 py-3 text-sm">
                                        {member.linkedin ? (
                                          <a 
                                            href={member.linkedin} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-[#009f3b] hover:text-[#00782d] hover:underline"
                                          >
                                            View Profile
                                          </a>
                                        ) : (
                                          <span className="text-gray-400">-</span>
                                        )}
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => {
                                              const id = member._id || member.id;
                                              if (!id) {
                                                showToast('Error: Team member ID is missing', 'error');
                                                // Team member missing ID
                                                return;
                                              }
                                              const teamId = String(id).trim();
                                              if (!teamId || teamId === 'undefined' || teamId === 'null') {
                                                showToast('Error: Invalid team member ID', 'error');
                                                console.error('Invalid team ID:', id, 'Stringified:', teamId);
                                                return;
                                              }
                                              setEditingTeam(teamId);
                                              setTeamName(member.name || '');
                                              setTeamPosition(member.position || '');
                                              const memberCategories = Array.isArray(member.category) 
                                          ? member.category 
                                          : (member.category ? [member.category] : []);
                                        setTeamCategory(memberCategories);
                                              setTeamPhone(member.phone || '');
                                              setTeamLinkedin(member.linkedin || '');
                                              setTeamDescription(member.description || '');
                                              setTeamImage(member.image || '');
                                              setShowTeamForm(true);
                                            }}
                                            className="px-3 py-1 bg-[#009f3b] text-white text-xs hover:bg-[#00782d] transition-colors"
                                          >
                                            Edit
                                          </button>
                                          <button 
                                            onClick={() => {
                                              let id = member._id || member.id;
                                              if (id && typeof id === 'object') {
                                                id = id.toString ? id.toString() : String(id);
                                              } else if (id) {
                                                id = String(id);
                                              }
                                              if (!id || id === 'undefined' || id === 'null') {
                                                showToast(`Error: Team member ID is missing for ${member.name}`, 'error');
                                                // Team member missing ID for deletion
                                                return;
                                              }
                                              const teamId = id.trim();
                                              if (!teamId || teamId === 'undefined' || teamId === 'null' || teamId === '') {
                                                showToast(`Error: Invalid team member ID for ${member.name}. ID value: "${teamId}"`, 'error');
                                                // Invalid team ID for deletion
                                                return;
                                              }
                                              if (teamId.length < 5 || !/^[a-zA-Z0-9_-]+$/.test(teamId)) {
                                                showToast(`Error: Invalid team member ID format for ${member.name}. ID: "${teamId}" (length: ${teamId.length})`, 'error');
                                                // Invalid ID format for deletion
                                                return;
                                              }
                                              showDeleteConfirmation(
                                                `Are you sure you want to delete ${member.name}? This action cannot be undone.`,
                                                () => {
                                                  deleteTeam(teamId);
                                                }
                                              );
                                            }}
                                            className="px-3 py-1 bg-[#00782d] text-white text-xs hover:bg-[#009f3b] transition-colors"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                </div>
                        ))}
              </div>
                    );
                  })()}
            </div>
          )}

              {/* Add/Edit Form */}
              {showTeamForm && (
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#009f3b]">
                      {editingTeam ? 'Edit Team Member' : 'Add New Team Member'}
                    </h3>
                    <button 
                      onClick={() => {
                        setShowTeamForm(false);
                        setEditingTeam(null);
                        setTeamName('');
                        setTeamPosition('');
                        setTeamCategory([]);
                        setTeamPhone('');
                        setTeamLinkedin('');
                        setTeamDescription('');
                        setTeamExperience('');
                        setTeamEducation('');
                        setTeamCertification('');
                        setTeamImage('');
                        setCopyFromMember('');
                      }}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Cancel
                </button>
              </div>
              
              {/* Copy from Existing Member */}
              {!editingTeam && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Copy from Existing Member <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                  </label>
                  <select
                    value={copyFromMember}
                    onChange={(e) => {
                      const memberId = e.target.value;
                      setCopyFromMember(memberId);
                      if (memberId) {
                        const member = teams.find((t: any) => (t._id || t.id) === memberId);
                        if (member) {
                          setTeamName(member.name || '');
                          setTeamPosition(member.position || '');
                          setTeamImage(member.image || '');
                          setTeamPhone(member.phone || '');
                          setTeamLinkedin(member.linkedin || '');
                          setTeamDescription(member.description || '');
                          setTeamExperience(member.experience || '');
                          setTeamEducation(member.education || '');
                          setTeamCertification(member.certification || '');
                          // Set categories as array
                          const memberCategories = Array.isArray(member.category) 
                            ? member.category 
                            : (member.category ? [member.category] : []);
                          setTeamCategory(memberCategories);
                        }
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black"
                  >
                    <option value="">Select a member to copy from...</option>
                    {teams.map((member: any) => (
                      <option key={member._id || member.id} value={member._id || member.id}>
                        {member.name} - {member.position}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
                <form onSubmit={handleSaveTeam} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Member Name *</label>
                      <input 
                        type="text" 
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black"
                        required
                      />
                    </div>
                    <div>
                      <ImageUploadField
                        label="Profile Image *"
                        imageUrl={teamImage}
                        onImageChange={setTeamImage}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Position *</label>
                      <input 
                        type="text" 
                        value={teamPosition}
                        onChange={(e) => setTeamPosition(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Categories <span className="text-gray-400 text-xs font-normal">(Select multiple)</span>
                      </label>
                      <div className="border border-gray-300 rounded p-3 max-h-40 overflow-y-auto">
                        {teamCategories.length > 0 ? (
                          <div className="space-y-2">
                            {teamCategories.map((cat) => (
                              <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={teamCategory.includes(cat)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setTeamCategory([...teamCategory, cat]);
                                    } else {
                                      setTeamCategory(teamCategory.filter((c) => c !== cat));
                                    }
                                  }}
                                  className="w-4 h-4 text-[#009f3b] border-gray-300 rounded focus:ring-[#009f3b]"
                                />
                                <span className="text-sm text-gray-700">{cat}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No categories available. Add a new category below.</p>
                        )}
                        <div className="mt-3 pt-3 border-t">
                          <input
                            type="text"
                            placeholder="Add new category"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const newCat = (e.target as HTMLInputElement).value.trim();
                                if (newCat && !teamCategories.includes(newCat)) {
                                  setTeamCategories([...teamCategories, newCat].sort());
                                  setTeamCategory([...teamCategory, newCat]);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                      </label>
                      <input 
                        type="tel" 
                        placeholder="e.g., +250 788 123 456"
                        value={teamPhone}
                        onChange={(e) => setTeamPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        LinkedIn URL <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                      </label>
                      <input 
                        type="url" 
                        placeholder="e.g., https://linkedin.com/in/username"
                        value={teamLinkedin}
                        onChange={(e) => setTeamLinkedin(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description/Summary <span className="text-gray-400">(Optional)</span>
                      </label>
                      <textarea
                        placeholder="Brief description or summary showcasing the team member's potential, expertise, and achievements..."
                        value={teamDescription}
                        onChange={(e) => setTeamDescription(e.target.value)}
                        rows={4}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] resize-y text-black placeholder:text-black"
                      />
                    </div>
                  </div>
                  
                  {/* Experience, Education, and Certification */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience <span className="text-gray-400">(Optional)</span>
                      </label>
                      <textarea
                        placeholder="List professional experience, previous roles, projects, etc..."
                        value={teamExperience}
                        onChange={(e) => setTeamExperience(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] resize-y text-black placeholder:text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Education <span className="text-gray-400">(Optional)</span>
                      </label>
                      <textarea
                        placeholder="List educational background, degrees, institutions, etc..."
                        value={teamEducation}
                        onChange={(e) => setTeamEducation(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] resize-y text-black placeholder:text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Certification <span className="text-gray-400">(Optional)</span>
                      </label>
                      <textarea
                        placeholder="List professional certifications, licenses, awards, etc..."
                        value={teamCertification}
                        onChange={(e) => setTeamCertification(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] resize-y text-black placeholder:text-black"
                      />
                    </div>
                  </div>
                    <div className="flex gap-3">
                      <button 
                        type="submit"
                        className="bg-[#009f3b] text-white px-6 py-2 rounded-none font-semibold hover:bg-[#00782d] transition-colors"
                      >
                        {editingTeam ? 'Update Team Member' : 'Add Team Member'}
                      </button>
                      <button 
                        onClick={() => {
                          setShowTeamForm(false);
                          setEditingTeam(null);
                        }}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-none font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                  </button>
                </div>
                </form>
              </div>
              )}
            </div>
          )}

          {/* Shop Management */}
          {activeTab === 'shop' && (
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#009f3b]">Shop Management</h2>
                <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => {
                      setShowShopForm(true);
                      setEditingShop(null);
                    }}
                    className="bg-[#009f3b] text-white px-3 md:px-4 py-2 text-sm md:text-base rounded-none font-semibold hover:bg-[#00782d] transition-colors flex-1 sm:flex-initial"
                  >
                    + Add Product
                  </button>
                  </div>
                </div>

              {/* Products List/Grid */}
              {!showShopForm && (
                    <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3 md:mb-4">Products ({products.length})</h3>
                  
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Image</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Product Name</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Price</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product._id || product.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="relative w-16 h-16">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">{product.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{product.price}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => {
                                    setShowShopForm(true);
                                    setEditingShop(product._id || product.id);
                                  }}
                                  className="px-3 py-1 bg-[#009f3b] text-white text-xs hover:bg-[#00782d] transition-colors"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => deleteShop(product._id || product.id)}
                                  className="px-3 py-1 bg-red-600 text-white text-xs hover:bg-red-700 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {products.map((product) => (
                      <div key={product._id || product.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex gap-4 mb-3">
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate">{product.name}</h4>
                            <p className="text-xs text-gray-600 mb-1">Price: <span className="font-medium">{product.price}</span></p>
                            <p className="text-xs text-gray-600">Category: <span className="font-medium">{product.category}</span></p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-3 border-t border-gray-200">
                          <button 
                            onClick={() => {
                              setShowShopForm(true);
                              setEditingShop(product._id || product.id);
                            }}
                            className="flex-1 px-3 py-2 bg-[#009f3b] text-white text-xs font-semibold hover:bg-[#00782d] transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteShop(product._id || product.id)}
                            className="flex-1 px-3 py-2 bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
            </div>
          )}

              {/* Add/Edit Form */}
              {showShopForm && (
                <div className="border-t pt-4 md:pt-6">
                  <form onSubmit={handleSaveShop}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <h3 className="text-base md:text-lg font-bold text-[#009f3b]">
                      {editingShop ? 'Edit Product' : 'Add New Product'}
                    </h3>
                <button
                        type="button"
                      onClick={() => {
                        setShowShopForm(false);
                        setEditingShop(null);
                          setShopName('');
                          setShopPrice('');
                          setShopCategory('');
                          setShopDescription('');
                          setShopImage('');
                      }}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Cancel
                </button>
              </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                          <input 
                            type="text" 
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black" 
                            required
                          />
                    </div>
                    <div>
                      <ImageUploadField
                            label="Product Image *"
                        imageUrl={shopImage}
                        onImageChange={setShopImage}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                          <input 
                            type="text" 
                            value={shopPrice}
                            onChange={(e) => setShopPrice(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black" 
                            placeholder="e.g., 100000 or $100"
                            required
                          />
                    </div>
                    <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                          <input 
                            type="text" 
                            value={shopCategory}
                            onChange={(e) => setShopCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black" 
                            placeholder="e.g., Furniture, Decor, etc."
                            required
                          />
                    </div>
                  </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea 
                          value={shopDescription}
                          onChange={(e) => setShopDescription(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] min-h-[100px] resize-y text-black placeholder:text-black" 
                          placeholder="Enter product description..."
                          rows={4}
                        />
                      </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                <button
                          type="submit"
                        className="bg-[#009f3b] text-white px-4 md:px-6 py-2 rounded-none font-semibold hover:bg-[#00782d] transition-colors flex-1 sm:flex-initial"
                      >
                        {editingShop ? 'Update Product' : 'Add Product'}
                </button>
                <button
                          type="button"
                        onClick={() => {
                          setShowShopForm(false);
                          setEditingShop(null);
                            setShopName('');
                            setShopPrice('');
                            setShopCategory('');
                            setShopDescription('');
                            setShopImage('');
                        }}
                        className="bg-gray-200 text-gray-700 px-4 md:px-6 py-2 rounded-none font-semibold hover:bg-gray-300 transition-colors flex-1 sm:flex-initial"
                      >
                        Cancel
                </button>
                    </div>
              </div>
                </form>
              </div>
            )}

            {/* Payment Method Management */}
            <div className="border-t pt-4 md:pt-6 mt-6 md:mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#009f3b]">Payment Methods</h2>
                <button 
                  onClick={() => {
                    setShowPaymentForm(true);
                    setEditingPayment(null);
                    setPaymentName('');
                    setPaymentType('');
                    setPaymentAccountName('');
                    setPaymentAccountNumber('');
                    setPaymentProvider('');
                    setPaymentInstructions('');
                    setPaymentIsActive(true);
                  }}
                  className="bg-[#009f3b] text-white px-3 md:px-4 py-2 text-sm md:text-base rounded-none font-semibold hover:bg-[#00782d] transition-colors w-full sm:w-auto"
                >
                  + Add Payment Method
                </button>
              </div>

              {/* Payment Methods List */}
              {!showPaymentForm && (
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3 md:mb-4">Payment Methods ({paymentMethods.length})</h3>
                  {paymentMethods.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No payment methods added yet.</p>
                  ) : (
                    <>
                      {/* Desktop Table View */}
                      <div className="hidden md:block overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Provider</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Account Number</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentMethods.map((method) => (
                            <tr key={method._id || method.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900 font-medium">{method.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-600 capitalize">{method.type}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{method.provider || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{method.accountNumber || '-'}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 text-xs rounded ${method.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {method.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => {
                                      setShowPaymentForm(true);
                                      setEditingPayment(method._id || method.id);
                                      setPaymentName(method.name || '');
                                      setPaymentType(method.type || '');
                                      setPaymentAccountName(method.accountName || '');
                                      setPaymentAccountNumber(method.accountNumber || '');
                                      setPaymentProvider(method.provider || '');
                                      setPaymentInstructions(method.instructions || '');
                                      setPaymentIsActive(method.isActive !== false);
                                    }}
                                    className="px-3 py-1 bg-[#009f3b] text-white text-xs hover:bg-[#00782d] transition-colors"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => deletePayment(method._id || method.id)}
                                    className="px-3 py-1 bg-red-600 text-white text-xs hover:bg-red-700 transition-colors"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                      {/* Mobile Card View */}
                      <div className="md:hidden space-y-4">
                        {paymentMethods.map((method) => (
                          <div key={method._id || method.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="space-y-2 mb-3">
                              <div className="flex justify-between items-start">
                                <h4 className="text-sm font-semibold text-gray-900">{method.name}</h4>
                                <span className={`px-2 py-1 text-xs rounded ${method.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {method.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">Type: <span className="font-medium capitalize">{method.type}</span></p>
                              {method.provider && (
                                <p className="text-xs text-gray-600">Provider: <span className="font-medium">{method.provider}</span></p>
                              )}
                              {method.accountNumber && (
                                <p className="text-xs text-gray-600">Account: <span className="font-medium">{method.accountNumber}</span></p>
                              )}
                            </div>
                            <div className="flex gap-2 pt-3 border-t border-gray-200">
                              <button 
                                onClick={() => {
                                  setShowPaymentForm(true);
                                  setEditingPayment(method._id || method.id);
                                  setPaymentName(method.name || '');
                                  setPaymentType(method.type || '');
                                  setPaymentAccountName(method.accountName || '');
                                  setPaymentAccountNumber(method.accountNumber || '');
                                  setPaymentProvider(method.provider || '');
                                  setPaymentInstructions(method.instructions || '');
                                  setPaymentIsActive(method.isActive !== false);
                                }}
                                className="flex-1 px-3 py-2 bg-[#009f3b] text-white text-xs font-semibold hover:bg-[#00782d] transition-colors"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => deletePayment(method._id || method.id)}
                                className="flex-1 px-3 py-2 bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Add/Edit Payment Method Form */}
              {showPaymentForm && (
                <div className="border-t pt-4 md:pt-6">
                  <form onSubmit={handleSavePayment}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                      <h3 className="text-base md:text-lg font-bold text-[#009f3b]">
                        {editingPayment ? 'Edit Payment Method' : 'Add New Payment Method'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPaymentForm(false);
                          setEditingPayment(null);
                          setPaymentName('');
                          setPaymentType('');
                          setPaymentAccountName('');
                          setPaymentAccountNumber('');
                          setPaymentProvider('');
                          setPaymentInstructions('');
                          setPaymentIsActive(true);
                        }}
                        className="text-gray-600 hover:text-gray-800 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method Name *</label>
                          <input 
                            type="text" 
                            value={paymentName}
                            onChange={(e) => setPaymentName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black" 
                            placeholder="e.g., MTN Mobile Money"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                          <select
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black"
                            required
                          >
                            <option value="">Select Type</option>
                            <option value="mobile_money">Mobile Money</option>
                            <option value="bank">Bank Transfer</option>
                            <option value="card">Card Payment</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Provider</label>
                          <input 
                            type="text" 
                            value={paymentProvider}
                            onChange={(e) => setPaymentProvider(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black" 
                            placeholder="e.g., MTN, Airtel, Bank Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Account Name</label>
                          <input 
                            type="text" 
                            value={paymentAccountName}
                            onChange={(e) => setPaymentAccountName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black" 
                            placeholder="Account holder name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                        <input 
                          type="text" 
                          value={paymentAccountNumber}
                          onChange={(e) => setPaymentAccountNumber(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black placeholder:text-black" 
                          placeholder="Phone number or account number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Instructions</label>
                        <textarea 
                          value={paymentInstructions}
                          onChange={(e) => setPaymentInstructions(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] min-h-[100px] resize-y text-black placeholder:text-black" 
                          placeholder="Additional payment instructions for customers..."
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="paymentIsActive"
                          checked={paymentIsActive}
                          onChange={(e) => setPaymentIsActive(e.target.checked)}
                          className="w-4 h-4 text-[#009f3b] border-gray-300 rounded focus:ring-[#009f3b]"
                        />
                        <label htmlFor="paymentIsActive" className="text-sm font-semibold text-gray-700">
                          Active (Show to customers)
                        </label>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="submit"
                          className="bg-[#009f3b] text-white px-4 md:px-6 py-2 rounded-none font-semibold hover:bg-[#00782d] transition-colors flex-1 sm:flex-initial"
                        >
                          {editingPayment ? 'Update Payment Method' : 'Add Payment Method'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowPaymentForm(false);
                            setEditingPayment(null);
                            setPaymentName('');
                            setPaymentType('');
                            setPaymentAccountName('');
                            setPaymentAccountNumber('');
                            setPaymentProvider('');
                            setPaymentInstructions('');
                            setPaymentIsActive(true);
                          }}
                          className="bg-gray-200 text-gray-700 px-4 md:px-6 py-2 rounded-none font-semibold hover:bg-gray-300 transition-colors flex-1 sm:flex-initial"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Management */}
        {activeTab === 'orders' && (
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-[#009f3b]">Orders Management</h2>
              <div className="text-sm text-gray-600">
                Total Orders: <span className="font-bold text-[#009f3b]">{orders.length}</span>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id || order.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                            <h3 className="text-base md:text-lg font-bold text-gray-900">
                              Order #{order.orderNumber}
                            </h3>
                            <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-500">
                            {new Date(order.orderDate || order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xl md:text-2xl font-bold text-[#009f3b]">
                            {new Intl.NumberFormat('en-RW', {
                              style: 'currency',
                              currency: 'RWF',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(order.subtotal || 0)}
                          </p>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-3 md:p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-2">Customer Information</h4>
                          <p className="text-xs md:text-sm text-gray-700"><span className="font-medium">Name:</span> {order.customer?.fullName}</p>
                          <p className="text-xs md:text-sm text-gray-700"><span className="font-medium">Email:</span> {order.customer?.email}</p>
                          <p className="text-xs md:text-sm text-gray-700"><span className="font-medium">Phone:</span> {order.customer?.phone}</p>
                        </div>
                        <div>
                          <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-2">Shipping Address</h4>
                          <p className="text-xs md:text-sm text-gray-700">{order.customer?.address}</p>
                          {order.customer?.city && (
                            <p className="text-xs md:text-sm text-gray-700">{order.customer.city}</p>
                          )}
                          {order.customer?.country && (
                            <p className="text-xs md:text-sm text-gray-700">{order.customer.country}</p>
                          )}
                        </div>
                      </div>

                      {/* Payment Method */}
                      {order.paymentMethod && (
                        <div className="mb-4 p-3 md:p-4 bg-gray-50 rounded-lg">
                          <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-2">Payment Method</h4>
                          <p className="text-xs md:text-sm text-gray-700">{order.paymentMethod.methodName}</p>
                        </div>
                      )}

                      {/* Order Items */}
                      <div className="mb-4">
                        <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-3">Order Items ({order.items?.length || 0})</h4>
                        <div className="space-y-2">
                          {order.items?.map((item: any, index: number) => (
                            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="relative w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.product?.image || '/placeholder.png'}
                                  alt={item.product?.name || 'Product'}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm md:text-base font-semibold text-gray-900 truncate">{item.product?.name}</p>
                                <p className="text-xs md:text-sm text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-left sm:text-right w-full sm:w-auto">
                                <p className="text-sm md:text-base font-bold text-[#009f3b]">
                                  {new Intl.NumberFormat('en-RW', {
                                    style: 'currency',
                                    currency: 'RWF',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                  }).format((item.product?.price || 0) * item.quantity)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      {order.notes && (
                        <div className="mb-4 p-3 md:p-4 bg-gray-50 rounded-lg">
                          <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-2">Order Notes</h4>
                          <p className="text-xs md:text-sm text-gray-700">{order.notes}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
                        <div className="flex-1 sm:flex-initial">
                          <select
                            value={order.status || 'pending'}
                            onChange={async (e) => {
                              try {
                                const res = await fetch(`/api/order/${order._id || order.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ status: e.target.value }),
                                });
                                if (res.ok) {
                                  await fetchAllData();
                                  showToast('Order status updated successfully!', 'success');
                                } else {
                                  showToast('Error updating order status', 'error');
                                }
                              } catch (error) {
                                showToast('Error updating order status', 'error');
                              }
                            }}
                            className="w-full sm:w-auto px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009f3b] text-black"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                        <button
                          onClick={async () => {
                            showDeleteConfirmation(
                              'Are you sure you want to delete this order?',
                              async () => {
                              try {
                                const res = await fetch(`/api/order/${order._id || order.id}`, {
                                  method: 'DELETE',
                                });
                                if (res.ok) {
                                  await fetchAllData();
                                  showToast('Order deleted successfully!', 'success');
                                } else {
                                  showToast('Error deleting order', 'error');
                                }
                              } catch (error) {
                                showToast('Error deleting order', 'error');
                              }
                            }
                            );
                          }}
                          className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs md:text-sm font-semibold"
                        >
                          Delete Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Inquiries Management */}
        {activeTab === 'inquiries' && (
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-[#009f3b]">Inquiries Management</h2>
              <div className="text-sm text-gray-600">
                Total Inquiries: <span className="font-bold text-[#009f3b]">{inquiries.length}</span>
              </div>
            </div>

            {inquiries.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Mail className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No inquiries yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Date</th>
                        <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 hidden md:table-cell">Phone</th>
                        <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Subject</th>
                        <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-gray-700 hidden lg:table-cell">Message</th>
                        <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map((inquiry) => (
                        <tr key={inquiry._id || inquiry.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-gray-600 whitespace-nowrap">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                            <br />
                            <span className="text-gray-400">{new Date(inquiry.createdAt).toLocaleTimeString()}</span>
                          </td>
                          <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-gray-900 font-medium">{inquiry.name}</td>
                          <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-gray-600">
                            <a href={`mailto:${inquiry.email}`} className="text-[#009f3b] hover:underline break-all">
                              {inquiry.email}
                            </a>
                          </td>
                          <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-gray-600 hidden md:table-cell">
                            {inquiry.phone || '-'}
                          </td>
                          <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-gray-900 capitalize">{inquiry.subject}</td>
                          <td className="px-3 md:px-4 py-3 text-xs md:text-sm text-gray-600 max-w-xs hidden lg:table-cell">
                            <div className="line-clamp-2" title={inquiry.message}>
                              {inquiry.message}
                            </div>
                          </td>
                          <td className="px-3 md:px-4 py-3">
                            <select
                              value={inquiry.status || 'new'}
                              onChange={async (e) => {
                                try {
                                  const res = await fetch(`/api/inquiry/${inquiry._id || inquiry.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ 
                                      status: e.target.value,
                                      readAt: e.target.value === 'read' ? new Date() : inquiry.readAt,
                                      repliedAt: e.target.value === 'replied' ? new Date() : inquiry.repliedAt
                                    }),
                                  });
                                  if (res.ok) {
                                    await fetchAllData();
                                    showToast('Inquiry status updated successfully!', 'success');
                                  } else {
                                    showToast('Error updating inquiry status', 'error');
                                  }
                                } catch (error) {
                                  showToast('Error updating inquiry status', 'error');
                                }
                              }}
                              className={`px-2 py-1 text-xs font-semibold rounded border-0 focus:outline-none focus:ring-2 focus:ring-[#009f3b] ${
                                inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                inquiry.status === 'read' ? 'bg-gray-100 text-gray-800' :
                                inquiry.status === 'replied' ? 'bg-green-100 text-green-800' :
                                'bg-gray-200 text-gray-700'
                              }`}
                            >
                              <option value="new">New</option>
                              <option value="read">Read</option>
                              <option value="replied">Replied</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td className="px-3 md:px-4 py-3">
                            <div className="flex flex-col sm:flex-row gap-1 md:gap-2">
                              {inquiry.email && (
                                <a
                                  href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`}
                                  className="px-2 md:px-3 py-1 bg-[#009f3b] text-white text-xs hover:bg-[#00782d] transition-colors text-center"
                                  title="Reply via Email"
                                >
                                  Reply
                                </a>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedInquiry(inquiry);
                                }}
                                className="px-2 md:px-3 py-1 bg-blue-600 text-white text-xs hover:bg-blue-700 transition-colors"
                                title="View Details"
                              >
                                View
                              </button>
                              <button
                                onClick={async () => {
                                  showDeleteConfirmation(
                                    'Are you sure you want to delete this inquiry?',
                                    async () => {
                                      try {
                                        const res = await fetch(`/api/inquiry/${inquiry._id || inquiry.id}`, {
                                          method: 'DELETE',
                                        });
                                        if (res.ok) {
                                          await fetchAllData();
                                          showToast('Inquiry deleted successfully!', 'success');
                                        } else {
                                          showToast('Error deleting inquiry', 'error');
                                        }
                                      } catch (error) {
                                        showToast('Error deleting inquiry', 'error');
                                      }
                                    }
                                  );
                                }}
                                className="px-2 md:px-3 py-1 bg-red-600 text-white text-xs hover:bg-red-700 transition-colors"
                                title="Delete"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Inquiry Detail Modal */}
        {selectedInquiry && (
          <div
            className="fixed inset-0 backdrop-blur-md bg-white/10 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedInquiry(null);
              }
            }}
          >
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-[#009f3b]">Inquiry Details</h3>
                  <button
                    onClick={() => {
                      setSelectedInquiry(null);
                    }}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Contact Information</h4>
                      <p className="text-sm text-gray-700"><span className="font-medium">Name:</span> {selectedInquiry.name}</p>
                      <p className="text-sm text-gray-700"><span className="font-medium">Email:</span> {selectedInquiry.email}</p>
                      {selectedInquiry.phone && (
                        <p className="text-sm text-gray-700"><span className="font-medium">Phone:</span> {selectedInquiry.phone}</p>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Details</h4>
                      <p className="text-sm text-gray-700"><span className="font-medium">Subject:</span> <span className="capitalize">{selectedInquiry.subject}</span></p>
                      <p className="text-sm text-gray-700"><span className="font-medium">Date:</span> {new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                      <p className="text-sm text-gray-700"><span className="font-medium">Status:</span> <span className="capitalize">{selectedInquiry.status || 'new'}</span></p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Message</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedInquiry.message}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    {selectedInquiry.email && (
                      <a
                        href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`}
                        className="px-4 py-2 bg-[#009f3b] text-white rounded-lg hover:bg-[#00782d] transition-colors text-sm font-semibold"
                      >
                        Reply via Email
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setSelectedInquiry(null);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        </div>
      </div>
      
      {/* PDF Viewer Modal */}
      {showPdfViewer && (
        <div 
          ref={pdfViewerRef}
          className={`fixed backdrop-blur-md bg-white/10 z-50 flex items-center justify-center transition-all ${
            isFullscreen ? 'inset-0 p-0' : 'inset-0 p-4'
          }`}
        >
          <div className={`bg-white rounded-lg flex flex-col transition-all ${
            isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[90vh]'
          }`}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold text-gray-800">PDF Viewer</h3>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    if (!isFullscreen) {
                      // Enter fullscreen
                      if (pdfViewerRef.current?.requestFullscreen) {
                        await pdfViewerRef.current.requestFullscreen();
                      }
                      setIsFullscreen(true);
                    } else {
                      // Exit fullscreen
                      if (document.exitFullscreen) {
                        await document.exitFullscreen();
                      }
                      setIsFullscreen(false);
                    }
                  }}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Maximize className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowPdfViewer(false);
                    setCurrentPdfUrl('');
                    setIsFullscreen(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Close PDF viewer"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={currentPdfUrl}
                className="w-full h-full border-0"
                title="PDF Viewer"
              />
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <a
                href={currentPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </a>
              <a
                href={`${currentPdfUrl}?download=true`}
                download
                className="px-4 py-2 bg-[#009f3b] text-white rounded hover:bg-[#00782d] transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Download PDF
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/10 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-gray-700 mb-6">{deleteConfirmMessage}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
