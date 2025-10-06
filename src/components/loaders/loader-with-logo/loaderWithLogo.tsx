import styles from "./loader.module.css";
import Image from "next/image";

function LoaderWithLogo() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <Image
          src="/loading-time.png"
          alt="logo"
          width={200}
          height={200}
          className="object-cover object-center mb-6 animate-pulse"
          priority
        />
        <div className="flex items-center gap-3">
          <div className={styles.loader} />
          <p className="text-slate-600 text-sm font-medium">Loading...</p>
        </div>
      </div>
    </div>
  );
}

export default LoaderWithLogo;
