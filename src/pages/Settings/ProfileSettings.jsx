import React, {useState} from "react";
import APICalls from "../../services/APICalls.js";
import toast from "react-hot-toast";
import {City, DefaultFemale, DefaultMale} from "../../Constants/constant.jsx";
import {subscribeUser, unsubscribeUser} from "../../services/Notification.jsx";
import { Calendar, Clock ,Check , Plus , CirclePlus, Loader2} from 'lucide-react';
export default function ProfileSettings({user ,fileInputRef , screenSize}) {
    let [response, setResponse] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userImgurl, setUserImgurl] = useState(user?.imageUrl);
    const [formData, setformData] = useState({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        gender: user.gender,
        bloodType: user.bloodType || '',
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        cityId: user.city.cityId,
        age: user.age,
        nationalId: user.nationalId,
        phoneNumber: user.phoneNumber,
        emergencyContactName: user?.emergencyContact.econtactName ,
        emergencyContactPhone: user?.emergencyContact.econtactPhone,
        emergencyContactRelation: user?.emergencyContact.econtactRelation,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData({
            ...formData,
            [name]: value
        });
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        setLoading(true);
        await APICalls.uploadProfilePicture(formData);
        await APICalls.GetCurrentUser();
        user =JSON.parse(localStorage.getItem("userData"));
        setLoading(false);
        setUserImgurl(user?.imageUrl);
    };

    const [enabled, setEnabled] = useState(user.hasPushSubscription);



    return(
        <form onSubmit={
            async (e) => {
                e.preventDefault();
                setError(null);
                setSaving(true);
                try{
                    const result = await APICalls.UpdateUser(formData);
                    setResponse(result);
                    toast.success('Profile updated successfully!');
                } catch (error) {
                    setError(error.message);
                    toast.error(error.message || 'Failed to update profile');
                    setSaving(false);
                } finally{
                    await APICalls.GetCurrentUser();
                    user = JSON.parse(localStorage.getItem("userData"));
                    setformData( {
                        username: user.username,
                        email: user.email,
                        fullName: user.fullName,
                        gender: user.gender,
                        bloodType: user.bloodType || '',
                        dateOfBirth: user.dateOfBirth,
                        address: user.address,
                        cityId: user.city.cityId,
                        age: user.age,
                        nationalId: user.nationalId,
                        phoneNumber: user.phoneNumber,
                        emergencyContactName: user?.emergencyContact.econtactName ,
                        emergencyContactPhone: user?.emergencyContact.econtactPhone,
                        emergencyContactRelation: user?.emergencyContact.econtactRelation,
                    });
                    setSaving(false);
                }
            }
        }>
            <div className="flex-row">

                <div className="flex flex-row">
                    <div className="relative overflow-hidden rounded-full mb-10">
                        {loading && <div className="absolute rounded-full w-50 h-50 bg-blue-500/30 ">
                            <img src='src/assets/Spinner@1x-1.0s-200px-200px.svg' alt="loading"
                                 className=" w-[130px] h-[130px] ml-9 mt-8 "/>
                        </div>}


                        <img

                            src={userImgurl != null ? userImgurl : (user.gender === "male" ? DefaultMale : DefaultFemale)}
                            alt="user" className="w-50 h-50 rounded-full object-cover"/>
                        <>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{display: "none"}}
                                onChange={handleFileUpload}
                            />

                            <button
                                onClick={handleButtonClick}
                                type="button"
                                className="absolute rounded-full w-50 h-50 bg-black/20 flex items-center justify-center -bottom-10 hover:bottom-0 opacity-0 hover:opacity-100 transition-all duration-100 ">
                                <div className="flex flex-row justify-center space-x-3 text-white"><Plus
                                    className="w-8 h-8"/> <p className="leading-8">Select
                                    image</p></div>
                            </button>
                        </>

                    </div>

                    <div className={`flex flex-col space-y-4`}>
                        <div className="flex flex-row  justify-center self-end ">
                            <div className='has-tooltip mr-2'>
                                <span className='tooltip rounded shadow-lg p-2 bg-blue-900 text-white'>Turn Medical Profile ON allows people to view your profile publicly </span>

                                Notification
                            </div>
                            <div>

                                <ToggleSwitch checked={enabled} onChange={() => {
                                    const next = !enabled;
                                    setEnabled(next);
                                    if (next) {
                                        subscribeUser();


                                    } else {
                                        unsubscribeUser();
                                    }
                                    user = JSON.parse(localStorage.getItem("userData"));
                                }}/>
                                <span className="ml-2">{enabled ? "On" : "Off"}</span>
                            </div>
                        </div>

                        <div className={`flex flex-col space-y-2`} style={{marginLeft: `${screenSize / 5}vw`}}>
                            <label className="text-lg ">Username</label>
                            <input type="text"
                                   id="username"
                                   name="username"
                                   className=" w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3 opacity-50 cursor-not-allowed"
                                   value={formData.username}
                                   onChange={handleChange}
                                   disabled={true}
                            />
                        </div>
                        <div className=" flex flex-col space-y-2" style={{marginLeft: `${screenSize / 5}vw`}}>
                            <label className="text-lg ">Email </label>
                            <input type="text"
                                   id="email"
                                   name="email"
                                   className="w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3"
                                   placeholder="Email"
                                   value={formData.email}
                                   onChange={handleChange}
                            />

                        </div>
                    </div>
                </div>


            </div>

            <div className="flex flex-col space-y-4">
                {/*first block*/}
                <div className=" flex flex-col space-y-2">
                    <label className="text-lg ">Full Name</label>
                    <input type="text"
                           id="fullName"
                           name="fullName"
                           className=" w-[calc(60vw-80px)] border-2 border-gray-200 rounded-lg p-3"
                           value={formData.fullName}
                           onChange={handleChange}
                    />
                </div>
                {/*second block*/}


                {/*third block*/}
                <div className="flex flex-row space-x-10">
                    <div className=" flex flex-col space-y-2">
                        <label className="text-lg ">Gender</label>
                        <select
                            className=" w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3"
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className=" flex flex-col space-y-2 ">
                        <label className="text-lg ">Age </label>
                        <input
                            className=" w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3"
                            type="number"
                            id="age"
                            name="age"
                            min="0"
                            max="120"
                            value={formData.age}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                <div className=" flex flex-col space-y-2">
                    <label className="text-lg">Blood Type</label>
                    <select
                        className=" w-[calc(60vw-80px)] border-2 border-gray-200 rounded-lg p-3"
                        id="bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                    >
                        <option value="">Select Blood Type</option>
                        <option value="A_POSITIVE">A+</option>
                        <option value="A_NEGATIVE">A-</option>
                        <option value="B_POSITIVE">B+</option>
                        <option value="B_NEGATIVE">B-</option>
                        <option value="AB_POSITIVE">AB+</option>
                        <option value="AB_NEGATIVE">AB-</option>
                        <option value="O_POSITIVE">O+</option>
                        <option value="O_NEGATIVE">O-</option>
                    </select>
                </div>

                <div className=" flex flex-col space-y-2">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                        className=" w-[calc(60vw-80px)] border-2 border-gray-200 rounded-lg p-3"
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                </div>
                {/*forth block*/}
                <div className="flex flex-row space-x-10">
                    <div className=" flex flex-col space-y-2">
                        <label className="text-lg ">address</label>
                        <input type="text"
                               id="address"
                               name="address"
                               className=" w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3"
                               placeholder="address"
                               value={formData.address}
                               onChange={handleChange}

                        />
                    </div>

                    <div className=" flex flex-col space-y-2">
                        <label className="text-lg ">City</label>
                        <select
                            className=" w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3"
                            id="cityId"
                            name="cityId"
                            value={formData.cityId}
                            onChange={handleChange}
                        >
                            {City.map((city,Index) => (
                                <option key={city} value={Index+1}> {city}</option>
                            ))}
                        </select>
                    </div>



                </div>

                {/*fifth block*/}
                <div className="flex flex-row space-x-10">
                    <div className=" flex flex-col space-y-2">
                        <label className="text-lg ">phoneNumber</label>
                        <input type="text"
                               id="phoneNumber"
                               name="phoneNumber"
                               className=" w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3"
                               placeholder="phoneNumber"
                               value={formData.phoneNumber}
                               onChange={handleChange}

                        />
                    </div>

                    <div className=" flex flex-col space-y-2">
                        <label className="text-lg ">nationalId</label>
                        <input type="text"
                               id="nationalId"
                               name="nationalId"
                               className=" w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3"
                               placeholder="nationalId"
                               value={formData.nationalId}
                               onChange={handleChange}

                        />
                    </div>





                </div>

                {/* Emergency Contact Section */}
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2 border-b pb-2">Emergency Contact</h3>

                <div className=" flex flex-col space-y-2">
                    <label className="text-lg">Emergency Contact Name</label>
                    <input type="text"
                           id="emergencyContactName"
                           name="emergencyContactName"
                           className=" w-[calc(60vw-80px)] border-2 border-gray-200 rounded-lg p-3"
                           placeholder="Emergency contact name"
                           value={formData.emergencyContactName}
                           onChange={handleChange}
                    />
                </div>

                <div className="flex flex-row space-x-10">
                    <div className=" flex flex-col space-y-2">
                        <label className="text-lg">Emergency Contact Phone</label>
                        <input type="text"
                               id="emergencyContactPhone"
                               name="emergencyContactPhone"
                               className=" w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3"
                               placeholder="Emergency contact phone"
                               value={formData.emergencyContactPhone}
                               onChange={handleChange}
                        />
                    </div>

                    <div className=" flex flex-col space-y-2">
                        <label className="text-lg">Relation</label>
                        <select
                            className=" w-[calc(30vw-60px)] border-2 border-gray-200 rounded-lg p-3"
                            id="emergencyContactRelation"
                            name="emergencyContactRelation"
                            value={formData.emergencyContactRelation}
                            onChange={handleChange}
                        >
                            <option value="">Select Relation</option>
                            <option value="Parent">Parent</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Sibling">Sibling</option>
                            <option value="Child">Child</option>
                            <option value="Friend">Friend</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    onClick={()=>{}}
                    className="bg-blue-500 text-white rounded-lg px-4 py-2 shadow
                    hover:shadow-md hover:bg-blue-600
                    active:shadow-sm active:translate-y-[1px]
                    transition-all duration-150"
                    aria-pressed="false"
                >
                    {saving && (
                        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                    )}

                    <span>{saving ? 'Saving...' : 'Save'}</span>
                </button>
            </div>
            {response && <p className="text-green-500">{response.message}</p>}
            {error && <p className="text-red-500">{error}</p>}

        </form>
    )

}
function ToggleSwitch({checked, onChange}) {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={onChange}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-500 transition-colors relative ">
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform  ${checked?"translate-x-5": "translate-x-0"}`}></div>
            </div>
        </label>
    );
}