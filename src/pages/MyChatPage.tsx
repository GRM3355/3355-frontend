import { useParams } from "react-router-dom";


export default function MyChatPage() {
  const { id } = useParams();

  return (
    <div>{id}</div>
  )
}
