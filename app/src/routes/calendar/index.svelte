<script>
  import { goto } from '@sapper/app';

  // when no parameter is given navigate to the calendar of the current month
  goto(`calendar/${new Date().toISOString()}`);
</script>