import { OrgRoleKind } from "@/__generated__/graphql";
import KeepAlive from "@/components/KeepAlive";
import { PageOrgRoleList } from "@/pages/org/roles"
import { useSearchParams } from "@ice/runtime";

export default () => {
  const [searchParams] = useSearchParams();

  return (<KeepAlive clearAlive>
    <PageOrgRoleList kind={OrgRoleKind.Group} orgId={searchParams.get('id') || ''} isFromSystem />
  </KeepAlive>
  );
}
