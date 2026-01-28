import { ILocation } from "./location"
import { IMultimedia } from "./multimedia"
import { ISeverity } from "./severity"
import { IStatus } from "./status"
import { IUser } from "./user"

export interface IIncident {
    id: string
    title: string
    description: string
    date: string,
    time: string
    multimedias: IMultimedia[]
    location: ILocation
    detail?: {
        status?: string
        ai_analysis?: any
        image_analysis?: any
        [key: string]: any
    }
    //ToDo a revisar estos datos
    severity?: string
    status?: string
    reported_by?: IUser,
    team?: string,
    timeline?: any[],
    keyEvents?: any[],
    causeTree?: any,
    ai_analysis?: any,
    image_analysis?: any,
    similarCases?: any[],
    actionsTaken?: any[]
    involvedPeople?: any[]
    people?: any[]
}