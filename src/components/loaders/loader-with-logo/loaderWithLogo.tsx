import styles from "./loader.module.css";

function LoaderWithLogo() {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <div className="text-center text-4xl font-bold mb-4">
        Interro<span className="text-sky-500">AI</span>
      </div>
      <div className="flex flex-row items-center mx-auto">
        <div className={styles.loader} />
      </div>
    </div>
  );
}

export default LoaderWithLogo;
