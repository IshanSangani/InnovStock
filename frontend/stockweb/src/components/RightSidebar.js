import React from 'react'
import { CiSearch } from "react-icons/ci";
import Avatar from "react-avatar";
import { Link } from 'react-router-dom';

const RightSidebar = ({ otherUsers }) => {

  return (
    <div className='w-[25%]'>
      <div className='flex items-center p-2 bg-gray-100 rounded-full outline-none w-full'>
        <CiSearch size="20px" />
        <input type="text" className='bg-transparent outline-none px-2' placeholder='Search' />
      </div>
      <div className='p-4 bg-gray-100 rounded-2xl my-4'>
        <h1 className='font-bold text-lg'>Who to follow</h1>
        {otherUsers?.length === 0 ? (
          <p className="text-gray-500 mt-2">No users to display</p>
        ) : (
          otherUsers?.map(({ user, profile }) => (
            <div key={user?._id} className='flex items-center justify-between my-3'>
              <div className='flex'>
                <div>
                  <Avatar 
                    src={profile?.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                    size="40" 
                    round={true} 
                  />
                </div>
                <div className='ml-2'>
                  <h1 className='font-bold'>{user?.name}</h1>
                  <p className='text-sm'>{`@${user?.username}`}</p>
                </div>
              </div>
              <div>
                <Link to={`/profile/${user?._id}`}>
                  <button className='px-4 py-1 bg-black text-white rounded-full'>Profile</button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RightSidebar