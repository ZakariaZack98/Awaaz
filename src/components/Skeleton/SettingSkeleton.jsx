import React from 'react'

const SettingSkeleton = () => {
    return (
        <div className="max-w-xl mx-auto p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-6 w-32"></div>
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                    <div className="w-32 h-4 bg-gray-200 rounded"></div>
                    <div className="w-24 h-3 bg-gray-200 rounded"></div>
                </div>
            </div>
            <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                    <div key={i}>
                        <div className="w-40 h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="w-full h-10 bg-gray-200 rounded"></div>
                    </div>
                ))}

                <div>
                    <div className="w-40 h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="w-full h-10 bg-gray-200 rounded"></div>
                </div>

                <div>
                    <div className="w-40 h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="w-full h-10 bg-gray-200 rounded"></div>
                </div>

                <div>
                    <div className="w-16 h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="w-full h-24 bg-gray-200 rounded"></div>
                </div>

                <div className="flex justify-between items-center border border-gray-300 rounded-md p-2">
                    <div className="w-32 h-4 bg-gray-200 rounded"></div>
                    <div className="w-11 h-6 bg-gray-200 rounded-full"></div>
                </div>

                <div>
                    <div className="w-16 h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="w-full h-10 bg-gray-200 rounded"></div>
                    <div className="w-48 h-3 bg-gray-200 rounded mt-2"></div>
                </div>

                <div className="flex justify-between items-center border border-gray-300 rounded-md p-2">
                    <div className="w-40 h-4 bg-gray-200 rounded"></div>
                    <div className="w-11 h-6 bg-gray-200 rounded-full"></div>
                </div>
            </div>

            <div className="w-full h-10 bg-gray-200 rounded mt-6"></div>
        </div>
    )
}

export default SettingSkeleton
