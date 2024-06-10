import NoteSectionCSS from "../css/note_section.module.css"

export const NoteSection = (props) =>{
    //get all notes from the specified VOD_ID
    return(
        <div className={NoteSectionCSS['notes-display']}>
            {props.vodID}
            {props.vodTimestamp}
        </div>
    )
}