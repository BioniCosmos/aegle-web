import { transfer } from '@/utils'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export interface Profile {
  id: string
  name: string
  inbounds: any
  outbound: any
  nodeId: string
}

export const useProfileStore = defineStore('profile', () => {
  const profile = ref({
    id: '',
    name: '',
    inbounds: '',
    outbound: '',
    nodeId: '',
  })
  const isToInsertProfile = ref(true)

  const router = useRouter()

  async function toInsertProfile(nodeId: string) {
    profile.value.nodeId = nodeId
    profile.value.id = ''
    profile.value.inbounds = ''
    profile.value.name = ''
    profile.value.outbound = ''
    isToInsertProfile.value = true
    await router.push('/profile')
  }

  async function toUpdateProfile(profile: Profile) {
    profile.inbounds = JSON.stringify(profile.inbounds, null, 2)
    profile.outbound = JSON.stringify(profile.outbound, null, 2)
    useProfileStore().$patch({ profile })
    isToInsertProfile.value = false
    await router.push('/profile')
  }

  async function insertProfile() {
    try {
      const profileClone = Object.assign({}, profile.value)
      profileClone.inbounds = JSON.parse(profile.value.inbounds)
      profileClone.outbound = JSON.parse(profile.value.outbound)
      await transfer('/api/profile', 'POST', profileClone)
      await router.push('/nodes')
    } catch (err) {
      console.error(err)
    }
  }

  async function updateProfile() {
    try {
      await transfer(`/api/profile/${profile.value.id}`, 'PATCH', profile.value)
      await router.push('/nodes')
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteProfile() {
    try {
      await transfer(`/api/profile/${profile.value.id}`, 'DELETE')
      await router.push('/nodes')
    } catch (err) {
      console.error(err)
    }
  }

  return { profile, isToInsertProfile, toInsertProfile, toUpdateProfile, insertProfile, updateProfile, deleteProfile }
})
