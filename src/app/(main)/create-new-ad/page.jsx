import React from 'react'
import UserAdsList from './_components/UserAdsList'
import ToolList from './_components/ToolList'

function AppHomePage() {
    return (
        <div>
            <ToolList />
            <UserAdsList />
        </div>
    )
}

export default AppHomePage