import React from 'react';

const StatsCard = ({ title, value, icon, bgColor, textColor, iconBg }) => {
    return (
        <div className={`${bgColor} border rounded-lg p-6`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`${textColor} text-sm font-medium`}>{title}</p>
                    <p className={`text-3xl font-bold ${textColor.replace('600', '900')}`}>{value}</p>
                </div>
                <div className={`${iconBg} p-3 rounded-full`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
