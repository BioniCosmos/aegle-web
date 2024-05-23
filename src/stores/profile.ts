import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from './common'

export interface Profile {
  name: string
  inbound: string
  outbound: string
  nodeId: string
}

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile>({
    name: '',
    inbound: '',
    outbound: '',
    nodeId: '',
  })
  const isToInsertProfile = ref(true)

  const router = useRouter()

  async function toInsertProfile(nodeId: string) {
    profile.value.nodeId = nodeId
    profile.value.inbound = ''
    profile.value.name = ''
    profile.value.outbound = ''
    isToInsertProfile.value = true
    await router.push('/profile')
  }

  async function toUpdateProfile(profile: Profile) {
    profile.inbound = JSON.stringify(profile.inbound, null, 2)
    profile.outbound = JSON.stringify(profile.outbound, null, 2)
    useProfileStore().$patch({ profile })
    isToInsertProfile.value = false
    await router.push('/profile')
  }

  async function insertProfile() {
    const profileClone = Object.assign({}, profile.value)
    await useMessage('/api/profile', 'POST', profileClone)
    await router.push('/nodes')
  }

  async function deleteProfile() {
    await useMessage(`/api/profile/${profile.value.name}`, 'DELETE')
    await router.push('/nodes')
  }

  return {
    profile,
    isToInsertProfile,
    toInsertProfile,
    toUpdateProfile,
    insertProfile,
    deleteProfile,
  }
})
