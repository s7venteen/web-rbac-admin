import { useMemo } from 'react'
import { useRequest } from 'ahooks'
import services from 'services'

import type { CheckboxOptionType } from 'antd/lib/checkbox'

interface CheckboxRoleListOptionType extends CheckboxOptionType { }

export default function useRoleList() {
  const { data: roleList, ...rest } = useRequest(services.role.getRoleList)

  const options = useMemo(() => {
    if (roleList?.data) {
      return roleList.data.map((item: any) => {
        return {
          label: item.roleName,
          value: item.id,
          disabled: false
        }
      }) as CheckboxRoleListOptionType[]
    }
  }, [roleList?.data])

  return {
    roleList,
    ...rest,
    options
  }
}