import { IBreadcrumbsLinkProps, IBreadcrumbsProps } from '../../types/components/breadcrumbs';
import { Link } from 'react-router-dom';

export function Breadcrumbs({ heading, links, action }: IBreadcrumbsProps) {
    const lastLink = links[links.length - 1].name;
    return (
        <div className="flex items-center justify-between mb-5">
            <div className="">
                {/* HEADING */}
                {heading && <h5 className="font-semibold text-lg dark:text-white-light">{heading}</h5>}

                {/* BREADCRUMBS */}
                {!!links.length && (
                    <div className="my-5">
                        <ol className="flex text-gray-500 font-semibold dark:text-white-dark">
                            {links.map((link, index) => (
                                <li
                                    key={link.name || ''}
                                    className={`flex items-center ${
                                        lastLink === link.name
                                            ? 'before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:mx-4 '
                                            : index !== 0
                                            ? 'before:w-1 before:h-1 before:rounded-full before:bg-white-dark before:inline-block before:relative before:mx-4 '
                                            : ''
                                    }`}
                                >
                                    <BreadcrumbsLink link={link} />
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
            {/* ACTION */}
            {action && action}
        </div>
    );
}

type Props = {
    link: IBreadcrumbsLinkProps;
};

export default function BreadcrumbsLink({ link }: Props) {
    if (link.href) {
        return (
            <Link to={link.href} className="hover:text-gray-500/70 dark:hover:text-white-dark/70">
                {link.name}
            </Link>
        );
    }

    return <div className="text-primary cursor-default">{link.name}</div>;
}
