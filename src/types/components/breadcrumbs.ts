export type IBreadcrumbsLinkProps = {
    name?: string;
    href?: string;
};

export interface IBreadcrumbsProps {
    heading?: string;
    activeLast?: boolean;
    action?: React.ReactNode;
    links: IBreadcrumbsLinkProps[];
}
