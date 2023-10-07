import RecyclePage from "@/pages/account/recycle";
import { useSearchParams } from "@ice/runtime";

export default () => {
  const [searchParams] = useSearchParams()

  return <RecyclePage isFromSystem={true} orgId={searchParams.get('orgId') ?? ''} />
}
