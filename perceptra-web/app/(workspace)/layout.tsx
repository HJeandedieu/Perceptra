import {redirect} from 'next/navigation';
import {Workspace} from '../../components/workspace';
import {currentUser} from '../../lib/session';
export default async function Layout({children}:{children:React.ReactNode}){const user=await currentUser();if(!user)redirect('/login');return <Workspace>{children}</Workspace>}
