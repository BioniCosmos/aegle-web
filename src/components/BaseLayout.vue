<template>
  <nav>
    <ul>
      <li>
        <slot name="title"></slot>
      </li>
    </ul>
    <ul>
      <slot name="operations"></slot>
    </ul>
  </nav>
  <slot></slot>
</template>
