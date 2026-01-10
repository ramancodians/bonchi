import { useState } from 'react';
import { User, Store, Check, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { State, City } from 'country-state-city';
import { createDMAgentAPI } from '../../hooks/api';
import { useDMDashboard } from '../../hooks/query';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const STEPS = [
    { id: 1, title: 'Personal Details', icon: User },
    // { id: 2, title: 'Shop & Location', icon: Store }, // Merged for simplicity or kept? Let's keep structure similar to old.
    { id: 2, title: 'Location & Shop', icon: Store },
    { id: 3, title: 'Review', icon: Check },
];

function DMCreateAgent() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [creating, setCreating] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '', mobile: '', password: '',
        father_name: '', // Added if backend supports, but my simple backend impl might strictly look for new schema fields.
        // My backend expected: first_name, last_name, email, mobile, password, district, state, block, pincode, full_address, shop_centre_name

        shop_centre_name: '',
        full_address: '',
        state: '',
        district: '',
        block: '',
        pincode: '',

        // Extra fields from old form that I generally didn't prioritize in simple backend, 
        // but can send them if I update backend or ignore them.
        // Let's stick to core fields needed for creation.
    });

    const states = State.getStatesOfCountry('IN');
    const [districts, setDistricts] = useState<any[]>([]);

    // Fetch assigned districts
    const { data: dashboardData } = useDMDashboard();
    const assignedDistricts = dashboardData?.stats?.assignedDistricts || [];

    // Auto-select if only one
    useState(() => {
        if (assignedDistricts.length === 1 && !formData.district) {
            setFormData(prev => ({ ...prev, district: assignedDistricts[0] }));
        }
    });

    const handleStateChange = (stateCode: string) => {
        const state = states.find(s => s.isoCode === stateCode);
        setFormData({ ...formData, state: state?.name || '', district: '' });
        if (state) {
            setDistricts(City.getCitiesOfState('IN', stateCode)); // Note: Library naming is City but often used for District in India context or close enough. 
            // Actually country-state-city has 'City' which are cities. 
            // Ideally we need Districts.
            // For 'IN', City.getCitiesOfState returns many cities.
            // Old code had custom LocationService.
            // Let's accept free text or filtered list if possible.
            // Or just use City list as "District" for now or text input if library is imperfect for districts.
            // Given I need to match valid districts for DM, text input might be safer if they know their district spelling, 
            // OR I just list cities and let them pick.
            // Let's use text input for District to avoid blocking if library misses one. 
            // BUT backend enforces "districts.includes(district)". So spelling must match what is in DB.
            // I should ideally fetch assigned districts from backend to populate dropdown.
        } else {
            setDistricts([]);
        }
    };

    const handleSubmit = async () => {
        setCreating(true);
        try {
            await createDMAgentAPI(formData);
            toast.success('Agent created successfully!');
            setTimeout(() => navigate('/district-manager/agents'), 1500);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create agent');
        } finally {
            setCreating(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label><input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label><input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label><input type="tel" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Password *</label><input type="password" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} /></div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Shop/Centre Name</label><input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" value={formData.shop_centre_name} onChange={e => setFormData({ ...formData, shop_centre_name: e.target.value })} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label><textarea className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" rows={2} value={formData.full_address} onChange={e => setFormData({ ...formData, full_address: e.target.value })} /></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <select
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    onChange={e => handleStateChange(e.target.value)}
                                    value={states.find(s => s.name === formData.state)?.isoCode || ''}
                                >
                                    <option value="">Select State</option>
                                    {states.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                {/* Using text input for now as District Manager should know their district, and city list is too long/inaccurate for districts */}
                                {/* Using dropdown populated from assigned districts */}
                                <select
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={formData.district}
                                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                                >
                                    <option value="">Select or Type District</option>
                                    {/* Ideally fetch from backend. For now, assuming user knows their district or I can fetch it. 
                                        Let's fetch it using a hook or passed prop. 
                                        Since I can't easily pass it without refactoring router, 
                                        I will fetch dashboard stats here too or rely on a new hook.
                                    */}
                                    {assignedDistricts?.map((d: string) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Block</label><input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" value={formData.block} onChange={e => setFormData({ ...formData, block: e.target.value })} /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label><input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} maxLength={6} /></div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4 bg-gray-50 p-6 rounded-2xl text-sm">
                        <div className="grid grid-cols-2 gap-6">
                            <div><span className="text-gray-500 block mb-1">Name</span><span className="font-semibold text-gray-800 text-base">{formData.first_name} {formData.last_name}</span></div>
                            <div><span className="text-gray-500 block mb-1">Mobile</span><span className="font-semibold text-gray-800 text-base">{formData.mobile}</span></div>
                            <div><span className="text-gray-500 block mb-1">Shop</span><span className="font-semibold text-gray-800 text-base">{formData.shop_centre_name}</span></div>
                            <div><span className="text-gray-500 block mb-1">District</span><span className="font-semibold text-gray-800 text-base">{formData.district}</span></div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <ToastContainer />
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Register New Agent</h1>
                <p className="text-gray-600 mt-1">Create a new agent account under your jurisdiction.</p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden">
                {/* Stepper */}
                <div className="p-8 border-b bg-gray-50/50">
                    <div className="flex justify-between relative max-w-2xl mx-auto">
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
                        {STEPS.map((step) => {
                            const Icon = step.icon;
                            const isActive = step.id === currentStep;
                            const isCompleted = step.id < currentStep;
                            return (
                                <div key={step.id} className="flex flex-col items-center bg-transparent px-4 z-10">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' : isCompleted ? 'bg-green-500 text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>
                                        {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{step.title}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-8">
                    {renderStepContent()}
                </div>

                <div className="p-8 border-t bg-gray-50 flex justify-between items-center">
                    <button
                        onClick={() => currentStep === 1 ? navigate('/district-manager/agents') : setCurrentStep(p => Math.max(1, p - 1))}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-gray-600 hover:bg-white hover:shadow-sm border border-transparent transition-all"
                    >
                        <ChevronLeft size={20} />
                        {currentStep === 1 ? 'Cancel' : 'Back'}
                    </button>

                    {currentStep < 3 ? (
                        <button
                            onClick={() => setCurrentStep(p => Math.min(3, p + 1))}
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold shadow-lg shadow-blue-100 transition-all active:scale-95"
                        >
                            Next
                            <ChevronRight size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={creating}
                            className="flex items-center gap-2 px-10 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold shadow-lg shadow-green-100 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {creating ? <RefreshCw className="animate-spin" size={20} /> : <Check size={20} />}
                            Complete Registration
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DMCreateAgent;
