<script setup lang="ts">
import PaginationBar from '@/components/PaginationBar.vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Pagination } from '@/type/pagination'
import { parseUser, type User } from '@/type/user'
import ky from 'ky'
import useSWRV from 'swrv'
import { ref } from 'vue'

type FullUser = User & { nextDate: Temporal.ZonedDateTime }

const page = ref(1)
const { data: pagination } = useSWRV<Pagination<FullUser>>(
  () => `/api/users?page=${page.value}`,
  (url) => ky(url, { parseJson: parseUser }).json(),
)

const isPaid = (user: FullUser) =>
  Temporal.ZonedDateTime.compare(
    user.nextDate,
    Temporal.Now.zonedDateTimeISO(),
  ) !== -1
</script>

<template>
  <Card>
    <CardHeader class="flex-row items-center">
      <CardTitle>Users</CardTitle>
      <Button as-child size="sm" class="ml-auto">
        <RouterLink to="/user">Add</RouterLink>
      </Button>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="font-semibold">Name</TableHead>
            <TableHead class="font-semibold">Email</TableHead>
            <TableHead class="font-semibold">Level</TableHead>
            <TableHead class="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody v-if="pagination === undefined">
          <TableRow v-for="i in 5" :key="i">
            <TableCell>
              <Skeleton class="h-3.5" />
            </TableCell>
            <TableCell>
              <Skeleton class="h-3.5" />
            </TableCell>
            <TableCell>
              <Skeleton class="h-3.5" />
            </TableCell>
            <TableCell>
              <Skeleton class="h-3.5" />
            </TableCell>
          </TableRow>
        </TableBody>
        <TableBody v-else>
          <TableRow v-if="pagination.items.length === 0">
            <TableCell colspan="4" class="text-center text-muted-foreground">
              Nothing here
            </TableCell>
          </TableRow>
          <TableRow
            v-else
            v-for="user in pagination.items"
            :key="user.id"
            @click="$router.push(`/user/${user.id}`)"
          >
            <TableCell>{{ user.name }}</TableCell>
            <TableCell>{{ user.email }}</TableCell>
            <TableCell>{{ user.level }}</TableCell>
            <TableCell class="font-semibold">
              <div v-if="isPaid(user)">{{ user.profiles.length }} profiles</div>
              <div v-else class="text-destructive">expired</div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
    <CardFooter
      v-if="pagination !== undefined && pagination.items.length !== 0"
    >
      <PaginationBar :total="pagination.total" v-model="page" />
    </CardFooter>
  </Card>
</template>
