<?php
declare(strict_types=1);

namespace Stackfactory\SfSeolighthouse\Domain\Repository;


/**
 *
 * This file is part of the "SEO Lighthouse Score" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * (c) 2021 Andreas Kauhold <info@stackfactory.de>, Stackfactory
 */

/**
 * The repository for LighthouseStatistics
 */
class LighthouseStatisticsRepository extends \TYPO3\CMS\Extbase\Persistence\Repository
{
    public function findLimitedEntries($limit, $target){
        $query = $this->createQuery();
        $query->setOrderings(
            [
                'crdate' => \TYPO3\CMS\Extbase\Persistence\QueryInterface::ORDER_ASCENDING,
            ]
        );
        $query->matching($query->equals('target', $target));
        $query->setLimit($limit);
        return $query->execute();
    }
}
