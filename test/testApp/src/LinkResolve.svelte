<script>
  import { useLinkResolve } from "../../../src";

  const resolve = useLinkResolve();

  window.resolveMap = {
    absHome: resolve("/"),
    absSomething: resolve("/something"),
    relSomething: resolve("something"),
    relBackSomething: resolve("../something"),
    relAppSomething: resolve("../../something"),
    relPastAppSomething: resolve("../../../something"),
    blogRoot: resolve(".."),
    appRoot: resolve("../.."),
  };
</script>
