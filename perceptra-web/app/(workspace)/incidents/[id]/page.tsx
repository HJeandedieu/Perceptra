import {Heading} from '../../../../components/workspace';import {IncidentDetail} from '../../../../components/incidents';
export default async function Page({params}:{params:Promise<{id:string}>}){return <><Heading title="Incident review" description="Evidence, operator response, and activity history."/><IncidentDetail id={(await params).id}/></>}
