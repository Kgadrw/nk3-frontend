'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  FolderOpen, 
  GraduationCap, 
  Users, 
  ShoppingCart, 
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
  Minimize
} from 'lucide-react';
import Image from 'next/image';
import { ToastContainer, Toast, ToastType } from '@/components/Toast';

type ActiveTab = 'dashboard' | 'portfolio' | 'team' | 'shop' | 'academy';

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
  const [aboutPageImage, setAboutPageImage] = useState('');
  const [aboutComponentImage, setAboutComponentImage] = useState('');
  const [aboutBackgroundImage, setAboutBackgroundImage] = useState('');
  
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
  const [partnerLogos, setPartnerLogos] = useState<string[]>([]);
  const [newPartnerLogo, setNewPartnerLogo] = useState('');
  
  // About Us content states
  const [aboutTitle, setAboutTitle] = useState('Our Story, Vision, and Values');
  const [aboutSubtitle, setAboutSubtitle] = useState('Learn about our commitment to excellence, innovation, and the principles that guide our work every day.');
  const [aboutQuote, setAboutQuote] = useState('We are dedicated to bringing your visions to life, transforming ideas into impactful architectural experiences. Our team combines creativity, technical expertise, and a deep understanding of local context to deliver projects that exceed expectations.');
  const [aboutParagraph1, setAboutParagraph1] = useState('We believe in the power of collaboration and creativity. Every project we undertake is a partnership, where we work closely with our clients to understand their unique needs, challenges, and aspirations.');
  const [aboutParagraph2, setAboutParagraph2] = useState('Our approach is holistic, combining design excellence, technical innovation, and strategic thinking. We don\'t just create buildings; we craft environments that inspire, function seamlessly, and stand the test of time.');
  const [aboutParagraph3, setAboutParagraph3] = useState('We stay ahead of industry trends, continuously learning and adapting to bring the latest innovations in architecture, engineering, and sustainable design to every project. Our commitment to quality and excellence has made us a trusted partner in Rwanda\'s construction industry.');
  const [aboutHomeHeading, setAboutHomeHeading] = useState('ABOUT US');
  const [aboutHomeSubheading, setAboutHomeSubheading] = useState('NK 3D ARCHITECTURE STUDIO.');
  const [aboutHomeSince, setAboutHomeSince] = useState('we are here since 2016');
  const [aboutHomeDescription1, setAboutHomeDescription1] = useState('We are a design and construction consultancy company established in 2016, specializing in planning, design and management of architectural, engineering and interior design projects practicing in Kigali Rwanda.');
  const [aboutHomeDescription2, setAboutHomeDescription2] = useState('The firm has a skilled team consisting of architects, engineers, quantity surveyors, technicians, designers, specialist consultants and support staff that are able to offer quality consultancy services on all types of construction work.');
  const [projectsCount, setProjectsCount] = useState('100+');
  const [clientsCount, setClientsCount] = useState('50+');
  const [yearsCount, setYearsCount] = useState('010');
  
  // Portfolio management state
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<string | null>(null);
  const [portfolioView, setPortfolioView] = useState<'grid' | 'list'>('grid');
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioCategory, setPortfolioCategory] = useState('');
  const [portfolioYear, setPortfolioYear] = useState('');
  const [portfolioDescription, setPortfolioDescription] = useState('');
  const [portfolioArea, setPortfolioArea] = useState('');
  const [portfolioClient, setPortfolioClient] = useState('');
  const [portfolioStatus, setPortfolioStatus] = useState('');
  const [portfolioLocation, setPortfolioLocation] = useState('');
  const [portfolioKeyFeatures, setPortfolioKeyFeatures] = useState('');
  
  // Team management state
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamPosition, setTeamPosition] = useState('');
  const [teamCategory, setTeamCategory] = useState('');
  const [teamPhone, setTeamPhone] = useState('');
  const [teamLinkedin, setTeamLinkedin] = useState('');
  
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
  
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [teamsRes, productsRes, publicationsRes, portfoliosRes, socialRes, partnersRes] = await Promise.all([
        fetch('/api/team'),
        fetch('/api/shop'),
        fetch('/api/academic'),
        fetch('/api/portfolio'),
        fetch('/api/social'),
        fetch('/api/partners')
      ]);
      
      const teamsData = await teamsRes.json();
      const productsData = await productsRes.json();
      const publicationsData = await publicationsRes.json();
      const portfoliosData = await portfoliosRes.json();
      const socialData = await socialRes.json();
      const partnersData = await partnersRes.json();
      
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
          console.warn('Team member missing ID:', team);
          return null;
        }
        
        return {
          ...team,
          id: id.trim(),
          _id: id.trim()
        };
      }).filter((team: any) => team && team.id); // Filter out teams without IDs
      console.log('Teams loaded:', teamsWithIds.length, 'members');
      console.log('Sample team IDs:', teamsWithIds.slice(0, 3).map((t: any) => ({ name: t.name, id: t.id, _id: t._id })));
      setTeams(teamsWithIds);
      setProducts(productsData || []);
      setPublications(publicationsData || []);
      setPortfolios(portfoliosData || []);
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
      if (partnersData) setPartnerLogos(partnersData.map((p: any) => p.logo));
    } catch (error) {
      console.error('Error fetching data:', error);
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
        area: portfolioArea,
        client: portfolioClient,
        status: portfolioStatus || 'Completed',
        keyFeatures: portfolioKeyFeatures
      };
      const url = editingPortfolio ? `/api/portfolio/${editingPortfolio}` : '/api/portfolio';
      const method = editingPortfolio ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchAllData();
        setShowPortfolioForm(false);
        setEditingPortfolio(null);
        // Reset form
        setPortfolioTitle('');
        setPortfolioCategory('');
        setPortfolioYear('');
        setPortfolioDescription('');
        setPortfolioArea('');
        setPortfolioClient('');
        setPortfolioStatus('');
        setPortfolioLocation('');
        setPortfolioKeyFeatures('');
        setPortfolioImage('');
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
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
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
        console.error('Invalid editingTeam ID:', editingTeam, 'Stringified:', teamId);
        return;
      }
      // MongoDB ObjectId should be 24 hex characters
      if (!/^[0-9a-fA-F]{24}$/.test(teamId)) {
        showToast('Error: Team member ID format is invalid. Please try refreshing the page.', 'error');
        console.error('Invalid ObjectId format:', teamId);
        return;
      }
    }
    
    try {
      const data = {
        name: teamName.trim(),
        position: teamPosition.trim(),
        category: teamCategory?.trim() || 'Uncategorized',
        image: teamImage.trim(),
        phone: teamPhone?.trim() || '',
        linkedin: teamLinkedin?.trim() || ''
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
        setTeamCategory('');
        setTeamPhone('');
        setTeamLinkedin('');
        setTeamImage('');
      } else {
        // Try to get error message from response
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            console.error('Team save error response:', errorData);
            // Try different possible error message fields
            errorMessage = errorData.error || errorData.message || errorData.msg || JSON.stringify(errorData) || errorMessage;
          } else {
            const errorText = await res.text();
            console.error('Team save error text:', errorText);
            errorMessage = errorText || errorMessage;
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        showToast(`Error: ${errorMessage}`, 'error');
        console.error('Team save failed - Status:', res.status, 'Message:', errorMessage);
      }
    } catch (error) {
      console.error('Error saving team:', error);
      showToast('Error saving team member. Please try again.', 'error');
    }
  };

  const deleteTeam = async (id: string) => {
    const teamId = String(id || '').trim();
    console.log('deleteTeam called with ID:', id, 'Stringified:', teamId);
    
    if (!teamId || teamId === 'undefined' || teamId === 'null' || teamId === '') {
      showToast('Error: Invalid team member ID', 'error');
      console.error('Invalid team ID for deletion - empty or undefined:', id, 'Stringified:', teamId);
      return;
    }
    
    // Log the ID format for debugging
    console.log('Team ID format check:', {
      id: teamId,
      length: teamId.length,
      isObjectIdFormat: /^[0-9a-fA-F]{24}$/.test(teamId),
      isAlphanumeric: /^[a-zA-Z0-9]+$/.test(teamId),
      firstChars: teamId.substring(0, 10)
    });
    
    // Very minimal validation - just check it's not empty
    // Let the API and MongoDB handle format validation
    if (teamId.length < 1) {
      showToast('Error: Invalid team member ID format - ID is too short', 'error');
      console.error('Invalid ID format for deletion - too short:', teamId, 'Length:', teamId.length);
      return;
    }
    
    try {
      const deleteUrl = `/api/team/${teamId}`;
      console.log('Attempting to delete team member:', {
        id: teamId,
        url: deleteUrl,
        urlLength: deleteUrl.length,
        encodedUrl: encodeURIComponent(teamId)
      });
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
            console.error('Delete error response:', errorData);
            errorMessage = errorData.error || errorData.message || errorData.msg || JSON.stringify(errorData) || errorMessage;
          } else {
            const errorText = await res.text();
            console.error('Delete error text:', errorText);
            errorMessage = errorText || errorMessage;
          }
        } catch (parseError) {
          console.error('Error parsing delete error response:', parseError);
        }
        showToast(`Error deleting team member: ${errorMessage}`, 'error');
        console.error('Delete failed - Status:', res.status, 'Message:', errorMessage);
      }
    } catch (error) {
      console.error('Error deleting team:', error);
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
      
      console.log('Saving shop product:', data);
      console.log('Editing mode:', editingShop ? 'Yes' : 'No');
      
      const url = editingShop ? `/api/shop/${editingShop}` : '/api/shop';
      const method = editingShop ? 'PUT' : 'POST';
      
      console.log('Sending request to:', url, 'Method:', method);
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      console.log('Response status:', res.status, res.statusText);
      
      const contentType = res.headers.get('content-type');
      console.log('Response content-type:', contentType);
      
      if (res.ok) {
        // Parse response to ensure it's valid
        let responseData;
        if (contentType && contentType.includes('application/json')) {
          responseData = await res.json();
          console.log('Success response data:', responseData);
        } else {
          const text = await res.text();
          console.log('Success response text:', text);
          try {
            responseData = JSON.parse(text);
          } catch (e) {
            console.warn('Response is not JSON, but status is OK');
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
        console.error('Shop save error:', errorMessage);
      }
    } catch (error: any) {
      console.error('Error saving shop:', error);
      showToast(`Error saving product: ${error.message || 'Please try again'}`, 'error');
    }
  };

  const deleteShop = async (id: string) => {
    if (!id) {
      showToast('Invalid product ID', 'error');
      return;
    }
    
    console.log('Delete shop - Product ID:', id);
    console.log('Delete shop - ID type:', typeof id);
    
    showDeleteConfirmation(
      'Are you sure you want to delete this product? This action cannot be undone.',
      async () => {
        try {
          console.log('Delete shop - Sending DELETE request to:', `/api/shop/${id}`);
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
            console.error('Delete shop error (JSON):', errorDetails);
          } catch (e) {
            console.error('Error parsing JSON error response:', e);
          }
        } else {
          try {
            const errorText = await res.text();
            console.error('Delete shop error (text):', errorText);
            if (errorText) errorMessage = errorText;
          } catch (e) {
            console.error('Error parsing text error response:', e);
          }
        }
        
        showToast(`Error deleting product: ${errorMessage}`, 'error');
        console.error('Delete shop failed - Status:', res.status, 'Details:', errorDetails);
      }
    } catch (error: any) {
      console.error('Error deleting shop (catch):', error);
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
    if (!pdfLink && !pdfFile) {
      showToast('Please provide either a PDF link or upload a PDF file', 'warning');
      return;
    }
    try {
      let finalPdfLink = pdfLink?.trim() || '';
      
      // If we have a file but the link hasn't been set yet (upload might have failed), try uploading
      if (pdfFile && !finalPdfLink) {
        console.log('PDF file selected but no link found, uploading to Cloudinary...');
        try {
          const { uploadToCloudinary } = await import('@/lib/cloudinary');
          finalPdfLink = await uploadToCloudinary(pdfFile, 'nk3d/pdfs');
          console.log('PDF uploaded successfully:', finalPdfLink);
          // Update the pdfLink state so it shows in the form
          setPdfLink(finalPdfLink);
        } catch (uploadError) {
          console.error('Failed to upload PDF to Cloudinary:', uploadError);
          showToast('Failed to upload PDF file. Please try again or provide a PDF link instead.', 'error');
          return;
        }
      }
      
      // Validate that we have a PDF link
      if (!finalPdfLink || finalPdfLink.trim() === '') {
        showToast('Please provide either a PDF link or upload a PDF file', 'warning');
        return;
      }
      
      const data = {
        title: academicTitle.trim(),
        author: academicAuthor.trim(),
        year: academicYear.trim(),
        description: academicDescription.trim(),
        pdfLink: finalPdfLink
      };
      
      console.log('Saving academic publication:', {
        editing: !!editingAcademy,
        data: data
      });
      
      const url = editingAcademy ? `/api/academic/${editingAcademy}` : '/api/academic';
      const method = editingAcademy ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      console.log('Academic save response:', res.status, res.statusText);
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
        setPdfFile(null);
      } else {
        // Try to get error message from response
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            console.error('Academic save error response:', errorData);
            errorMessage = errorData.error || errorData.message || errorData.msg || JSON.stringify(errorData) || errorMessage;
          } else {
            const errorText = await res.text();
            console.error('Academic save error text:', errorText);
            errorMessage = errorText || errorMessage;
          }
        } catch (parseError) {
          console.error('Error parsing academic save error response:', parseError);
        }
        showToast(`Error: ${errorMessage}`, 'error');
        console.error('Academic save failed - Status:', res.status, 'Message:', errorMessage);
      }
    } catch (error) {
      console.error('Error saving academic:', error);
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
                console.error('Error parsing JSON error response:', e);
              }
            } else {
              try {
                const errorText = await res.text();
                if (errorText) errorMessage = errorText;
              } catch (e) {
                console.error('Error parsing text error response:', e);
              }
            }
            
            showToast(`Error: ${errorMessage}`, 'error');
            console.error('Academic delete failed - Status:', res.status, 'Message:', errorMessage);
          }
        } catch (error: any) {
          console.error('Error deleting academic:', error);
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
      console.error('Error saving social links:', error);
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
        console.error('Failed to upload company profile PDF:', error);
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
        console.error('Error uploading PDF:', error);
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
    try {
      const res = await fetch(`/api/partners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
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
        console.error('Failed to upload to Cloudinary:', error);
        // Keep the local preview if upload fails
      }
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
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] focus:border-transparent"
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
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex relative">
        {/* Sidebar - Primary Green */}
        <aside className={`fixed left-0 top-0 ${isSidebarMinimized ? 'lg:w-20 w-64' : 'w-64'} ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} bg-[#009f3b] shadow-lg h-screen overflow-y-auto flex flex-col transition-all duration-300 z-50`}>
          {/* Toggle Button - At Top */}
          <div className="p-4">
            <button
              onClick={() => {
                setIsSidebarMinimized(!isSidebarMinimized);
                setIsMobileSidebarOpen(false);
              }}
              className="w-full flex items-center justify-center p-2 text-white hover:bg-[#00782d] transition-colors"
              title={isSidebarMinimized ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className={`p-6 ${isSidebarMinimized ? 'px-4' : ''}`}>
            <div className="flex flex-col items-center">
              <div className={`${isSidebarMinimized ? 'w-12 h-12' : 'w-20 h-20'} bg-white rounded-full flex items-center justify-center ${isSidebarMinimized ? 'mb-2' : 'mb-4'} transition-all`}>
                <User className={`${isSidebarMinimized ? 'w-6 h-6' : 'w-10 h-10'} text-[#009f3b]`} />
        </div>
              {!isSidebarMinimized && (
                <>
                  <h3 className="text-white font-semibold text-lg mb-1">Admin User</h3>
                  <p className="text-white/80 text-sm">admin@nk3dstudio.rw</p>
                </>
              )}
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

          {/* Summary Cards */}
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
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter/X URL</label>
                      <input
                        type="url"
                        value={socialLinks.twitter}
                        onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
                        placeholder="https://twitter.com/yourhandle"
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn URL</label>
                      <input
                        type="url"
                        value={socialLinks.linkedin}
                        onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                        placeholder="https://linkedin.com/company/yourcompany"
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram URL</label>
                      <input
                        type="url"
                        value={socialLinks.instagram}
                        onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})}
                        placeholder="https://instagram.com/yourhandle"
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
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
                        {partnerLogos.map((logo, index) => (
                          <div key={index} className="relative border border-gray-200 p-3">
                            <img src={logo} alt={`Partner ${index + 1}`} className="w-full h-20 object-contain" />
                            <button
                              onClick={() => {
                                setPartnerLogos(partnerLogos.filter((_, i) => i !== index));
                              }}
                              className="absolute -top-2 -right-2 bg-[#00782d] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-[#009f3b]"
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
                      setPortfolioYear('');
                      setPortfolioDescription('');
                      setPortfolioArea('');
                      setPortfolioClient('');
                      setPortfolioStatus('');
                      setPortfolioLocation('');
                      setPortfolioKeyFeatures('');
                      setPortfolioImage('');
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
                              <button className="flex-1 px-3 py-2 bg-[#009f3b] text-white text-sm hover:bg-[#00782d] transition-colors flex items-center justify-center gap-1">
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
                              <button className="px-3 py-2 bg-[#00782d] text-white text-sm hover:bg-[#009f3b] transition-colors">
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
                                <button className="px-3 py-1 bg-[#009f3b] text-white text-sm hover:bg-[#00782d] transition-colors flex items-center gap-1">
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
                                <button className="px-3 py-1 bg-[#00782d] text-white text-sm hover:bg-[#009f3b] transition-colors">
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
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]" 
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                        <input 
                          type="text" 
                          value={portfolioCategory}
                          onChange={(e) => setPortfolioCategory(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
                          required
                        />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Year *</label>
                        <input 
                          type="text" 
                          placeholder="e.g., 2024" 
                          value={portfolioYear}
                          onChange={(e) => setPortfolioYear(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
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
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
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
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Client</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Private Developer" 
                          value={portfolioClient}
                          onChange={(e) => setPortfolioClient(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                        <select 
                          value={portfolioStatus}
                          onChange={(e) => setPortfolioStatus(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
                        >
                          <option value="">Select Status</option>
                          <option value="Completed">Completed</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Planned">Planned</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Kigali, Rwanda" 
                          value={portfolioLocation}
                          onChange={(e) => setPortfolioLocation(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]" 
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Key Features</label>
                    <textarea 
                      rows={4} 
                      placeholder="Enter key features, one per line or separated by commas"
                      value={portfolioKeyFeatures}
                      onChange={(e) => setPortfolioKeyFeatures(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]" 
                    />
                    <p className="text-xs text-gray-500 mt-1">List the key features of this project</p>
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
                            {publication.pdfLink && (
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
                            )}
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
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
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
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
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
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
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
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
                        required
                      />
                  </div>
                    <div className="border-t pt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">PDF Document</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">PDF Link (URL)</label>
                          <input 
                            type="url" 
                            value={pdfLink}
                            onChange={(e) => setPdfLink(e.target.value)}
                            placeholder="https://example.com/publication.pdf"
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]" 
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
                                      console.error('Failed to upload PDF to Cloudinary:', error);
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
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#009f3b]">Team Management</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setEditingTeam(null);
                      setTeamName('');
                      setTeamPosition('');
                      setTeamCategory('');
                      setTeamPhone('');
                      setTeamLinkedin('');
                      setTeamImage('');
                      setShowTeamForm(true);
                    }}
                    className="bg-[#009f3b] text-white px-4 py-2 rounded-none font-semibold hover:bg-[#00782d] transition-colors"
                  >
                  + Add Team Member
                </button>
                </div>
                </div>

              {/* Team List/Grid */}
              {!showTeamForm && (
                  <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Team Members ({teams.length})</h3>
                  
                  {/* Group teams by category */}
                  {(() => {
                    const groupedTeams = teams.reduce((acc, member) => {
                      const category = member.category && member.category.trim() ? member.category : 'Uncategorized';
                      if (!acc[category]) {
                        acc[category] = [];
                      }
                      acc[category].push(member);
                      return acc;
                    }, {} as Record<string, typeof teams>);

                    const categories = Object.keys(groupedTeams);

                    return (
                      <div className="space-y-8">
                        {categories.map((category) => (
                          <div key={category} className="space-y-4">
                            <h4 className="text-xl font-bold text-[#009f3b] border-b-2 border-[#009f3b] pb-2 mb-4">
                              {category} ({groupedTeams[category].length})
                            </h4>
                            
                            <div className="overflow-x-auto">
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
                                                console.error('Team member missing ID:', member);
                                                return;
                                              }
                                              // Ensure ID is a string and valid
                                              const teamId = String(id).trim();
                                              if (!teamId || teamId === 'undefined' || teamId === 'null') {
                                                showToast('Error: Invalid team member ID', 'error');
                                                console.error('Invalid team ID:', id, 'Stringified:', teamId);
                                                return;
                                              }
                                              console.log('Setting editingTeam to:', teamId);
                                              setEditingTeam(teamId);
                                              setTeamName(member.name || '');
                                              setTeamPosition(member.position || '');
                                              setTeamCategory(member.category || '');
                                              setTeamPhone(member.phone || '');
                                              setTeamLinkedin(member.linkedin || '');
                                              setTeamImage(member.image || '');
                                              setShowTeamForm(true);
                                            }}
                                            className="px-3 py-1 bg-[#009f3b] text-white text-xs hover:bg-[#00782d] transition-colors"
                                          >
                                            Edit
                                          </button>
                                          <button 
                                            onClick={() => {
                                              // Extract ID - handle various formats
                                              let id = member._id || member.id;
                                              
                                              // If ID is an object, convert it to string
                                              if (id && typeof id === 'object') {
                                                id = id.toString ? id.toString() : String(id);
                                              } else if (id) {
                                                id = String(id);
                                              }
                                              
                                              console.log('Delete button clicked - Member:', member.name, 'Raw ID:', member._id || member.id, 'Processed ID:', id, 'Full member:', member);
                                              
                                              if (!id || id === 'undefined' || id === 'null') {
                                                showToast(`Error: Team member ID is missing for ${member.name}`, 'error');
                                                console.error('Team member missing ID for deletion:', member);
                                                return;
                                              }
                                              
                                              const teamId = id.trim();
                                              
                                              if (!teamId || teamId === 'undefined' || teamId === 'null' || teamId === '') {
                                                showToast(`Error: Invalid team member ID for ${member.name}. ID value: "${teamId}"`, 'error');
                                                console.error('Invalid team ID for deletion:', id, 'Stringified:', teamId, 'Member object:', member);
                                                return;
                                              }
                                              
                                              // More lenient validation - just check it's not too short and has valid characters
                                              if (teamId.length < 5 || !/^[a-zA-Z0-9_-]+$/.test(teamId)) {
                                                showToast(`Error: Invalid team member ID format for ${member.name}. ID: "${teamId}" (length: ${teamId.length})`, 'error');
                                                console.error('Invalid ID format for deletion:', teamId, 'Length:', teamId.length, 'Member:', member);
                                                return;
                                              }
                                              
                                              showDeleteConfirmation(
                                                `Are you sure you want to delete ${member.name}? This action cannot be undone.`,
                                                () => {
                                                  console.log('Confirmed deletion for team member:', member.name, 'ID:', teamId);
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
                      }}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Cancel
                </button>
              </div>
                <form onSubmit={handleSaveTeam} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Member Name *</label>
                      <input 
                        type="text" 
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
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
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g., Founder, Technical Team, Management"
                        value={teamCategory}
                        onChange={(e) => setTeamCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]" 
                      />
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
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]" 
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
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]" 
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
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#009f3b]">Shop Management</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setShowShopForm(true);
                      setEditingShop(null);
                    }}
                    className="bg-[#009f3b] text-white px-4 py-2 rounded-none font-semibold hover:bg-[#00782d] transition-colors"
                  >
                    + Add Product
                  </button>
                  </div>
                </div>

              {/* Products List/Grid */}
              {!showShopForm && (
                    <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Products ({products.length})</h3>
                  
                  <div className="overflow-x-auto">
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
            </div>
          )}

              {/* Add/Edit Form */}
              {showShopForm && (
                <div className="border-t pt-6">
                  <form onSubmit={handleSaveShop}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-[#009f3b]">
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
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]" 
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
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                          <input 
                            type="text" 
                            value={shopPrice}
                            onChange={(e) => setShopPrice(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]" 
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
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b]" 
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
                          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f3b] min-h-[100px] resize-y" 
                          placeholder="Enter product description..."
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="bg-[#009f3b] text-white px-6 py-2 rounded-none font-semibold hover:bg-[#00782d] transition-colors"
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
                          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-none font-semibold hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      
      {/* PDF Viewer Modal */}
      {showPdfViewer && (
        <div 
          ref={pdfViewerRef}
          className={`fixed bg-black bg-opacity-75 z-50 flex items-center justify-center transition-all ${
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
