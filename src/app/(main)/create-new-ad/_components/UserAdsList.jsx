'use client';
import Image from 'next/image';
import React, { useState } from 'react'

const UserAdsList = () => {
    const [adsList, setAdsList] = useState([]);
  return (
    <div>
      <h2 className='font-bold text-2xl mb-2 mt-6'>My Ads</h2>

      {adsList.length === 0 &&
        <div className="p-5 border-dashed border-2 rounded-2xl flex flex-col items-center mt-6 gap-3" >
            <Image src={'/signboard.png'} alt='empty' 
            width={200} 
            height={200}
            className='w-20' 
            />
            <h2 className='text-xl'>You don't have any ads</h2>
        </div>
      }
    </div>
  )
}

export default UserAdsList
