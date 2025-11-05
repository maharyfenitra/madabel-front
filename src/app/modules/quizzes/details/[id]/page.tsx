"use client"
import { useParams } from 'next/navigation';
import QuizDetail from '../../components/QuizDetail'

type Props = {
  params: { id: string }
}

export default function Page(){
  const params = useParams() as { id: string };
  const id = parseInt(params.id, 10);
  return (
    <div className="py-6">
      <QuizDetail id={id} />
    </div>
  )
}
