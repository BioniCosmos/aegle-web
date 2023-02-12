import { transfer } from '@/utils'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export interface Profile {
  id: string
  name: string
  inbound: any
  outbound: any
  nodeId: string
}

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile>({
    id: '',
    name: '',
    inbound: '',
    outbound: '',
    nodeId: '',
  })
  const isToInsertProfile = ref(true)

  const router = useRouter()

  async function toInsertProfile(nodeId: string) {
    profile.value.nodeId = nodeId
    profile.value.id = ''
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
    profileClone.inbound = JSON.parse(profile.value.inbound)
    profileClone.outbound = JSON.parse(profile.value.outbound)
    await transfer('/api/profile', 'POST', profileClone)
    await router.push('/nodes')
  }

  async function deleteProfile() {
    await transfer(`/api/profile/${profile.value.id}`, 'DELETE')
    await router.push('/nodes')
  }

  return { profile, isToInsertProfile, toInsertProfile, toUpdateProfile, insertProfile, deleteProfile }
})
