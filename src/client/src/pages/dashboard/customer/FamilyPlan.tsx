import React from 'react';
import { Users, Shield, Heart, CheckCircle } from 'lucide-react';

const FamilyPlan = () => {
    return (
        <div className="p-4 pb-24 md:pb-6">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                        <Users size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Bonchi Family Protection</h1>
                        <p className="opacity-90">Comprehensive healthcare for your loved ones</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Shield className="text-purple-600" />
                        Plan Benefits
                    </h2>
                    <ul className="space-y-4">
                        {[
                            "Coverage for up to 4 family members",
                            "Priority support for all members",
                            "Unified health records dashboard",
                            "Emergency ambulance assistance for family",
                            "Discounts on medicines and checkups"
                        ].map((benefit, index) => (
                            <li key={index} className="flex items-center gap-3">
                                <CheckCircle className="text-green-500 shrink-0" size={20} />
                                <span className="text-gray-700">{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                    <Heart className="text-red-500 mb-4" size={48} />
                    <h2 className="text-xl font-bold mb-2">Upgrade to Family Plan</h2>
                    <p className="text-gray-500 mb-6">
                        Secure your family's health today. Contact our support team to upgrade your current plan.
                    </p>
                    <button className="btn btn-primary bg-purple-600 hover:bg-purple-700 border-none w-full max-w-xs transition-transform hover:scale-105">
                        Contact Support to Upgrade
                    </button>
                    <p className="text-xs text-gray-400 mt-4">
                        Terms and conditions apply. Existing individual plans will be merged.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FamilyPlan;
